import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useAuth } from "@/src/context/AuthContext";
import { useTheme } from "@/src/context/ThemeContext";
import { getAssignedAssets } from "@/src/services/asset.service";
import { getCategories } from "@/src/services/category.service";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { RefreshControl } from "react-native";
import { API_URL } from "../../../api/client";
import DashboardSkeleton from "../../../components/skeletons/DashboardSkeleton";
import useIsOnline from "../../../utils/useIsOnline";

type Asset = {
  id: string;
  asset_code: string;
  name: string;
  serial_number: string;
  status: string;
  condition: string;
  warranty_period: number;
  image_url: string | null;
  category: {
    id: string;
    name: string;
  };
};

export function normalizeImageUrl(
  url?: string | null
) : string {
  if (!url) {
    return "https://via.placeholder.com/150";
  }

  return url.replace(
    "http://localhost",
    API_URL
  );
}

export default function DashboardScreen() {
   const {user, isLoading: authLoading } = useAuth();
   const {colors, isDark} = useTheme();
   const [assets, setAssets] = useState<Asset[]>([]);
   const [categories, setCategories ] = useState<any[]>([]);
   const [selectedCategory, setSelectedCategory] = useState("All");
   const [loading, setLoading] = useState(true);
   const [searchQuery, setSearchQuery] = useState("");
   const [showCategories, setShowCategories] = useState(false);
   const [refreshing, setRefreshing] = useState(false);
   const [hasLoadError, setHasLoadError] = useState(false);
   const isOnline = useIsOnline();

  const filteredAssets = assets.filter((item) => {
        if (!item) return false;
        const query = searchQuery.toLowerCase();

        const matchesSearch =
          (item.name || "").toLowerCase().includes(query) ||
          (item.serial_number || "").toLowerCase().includes(query);

        const matchesCategory =
          selectedCategory === "All" ||
          (item.category?.name || "") === selectedCategory;

        return matchesSearch && matchesCategory;
     
  });

  const isGloballyEmpty = !loading && assets.length === 0;

  const categoryList = [{ id: 0, name: "All" }, ...(categories?? [])];

  const loadAssets = async () => {
    

    try {
      setLoading(true);

      setHasLoadError(false);

      const [assignedAssets, rescategories] =
        await Promise.all([
          getAssignedAssets(),
          getCategories(),
        ]);

      setAssets(assignedAssets || []);
      setCategories(rescategories || []);

    }catch(error){
      setHasLoadError(true);
    }
     finally {
      setLoading(false);
    }
  };
  
  const onRefresh = async () => {
  try {
    setRefreshing(true);

    await loadAssets();

  } catch (error) {
    console.log("REFRESH ERROR:", error);
  } finally {
    setRefreshing(false);
  }
};

  useFocusEffect(
    useCallback(() => {
      if (user?.id) {
        loadAssets();
      }
    }, [user?.id])
 )

    if (loading) {
      return <DashboardSkeleton />;
    }
    if (!user){
      return null;
    }

    if (!isOnline) {
      return (
        <View
          style={[
            styles.emptyContainer,
            { backgroundColor: colors.background }
          ]}
        >
          <Ionicons
            name="cloud-offline-outline"
            size={80}
            color={colors.subText}
          />

          <Text
            style={[
              styles.emptyTitle,
              { color: colors.text }
            ]}
          >
            No Internet Connection
          </Text>

          <Text
            style={[
              styles.emptySubtitle,
              { color: colors.subText }
            ]}
          >
            Please check your internet connection and try again.
          </Text>
        </View>
      );
   }

    if (hasLoadError) {
      return (
        <View
          style={[
            styles.emptyContainer,
            { backgroundColor: colors.background }
          ]}
        >
          <Ionicons
            name="alert-circle-outline"
            size={80}
            color="#EF4444"
          />

          <Text
            style={[
              styles.emptyTitle,
              { color: colors.text }
            ]}
          >
            Unable to Load Assets
          </Text>

          <Text
            style={[
              styles.emptySubtitle,
              { color: colors.subText }
            ]}
          >
            Something went wrong while loading data. Please try again.
          </Text>

          <TouchableOpacity
            style={{
              marginTop: 20,
              backgroundColor: colors.primary,
              paddingHorizontal: 20,
              paddingVertical: 12,
              borderRadius: 10,
            }}
            onPress={loadAssets}
          >
            <Text
              style={{
                color: "#fff",
                fontWeight: "600",
              }}
            >
              Retry
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

      if (isGloballyEmpty) {
        return (
                  <ScrollView
                    style={[
                      styles.container,
                      { backgroundColor: colors.background },
                    ]}
                    contentContainerStyle={{ flexGrow: 1 }}
                    refreshControl={
                      <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={colors.primary}
                        colors={[colors.primary]}
                      />
                    }
                  >
                  <View style={styles.profileHeader}>
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>
                        {user?.name?.charAt(0)?.toUpperCase()}
                      </Text>
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text style={[styles.companyName, { color: colors.subText }]}>
                        AGGA.IO IT Asset System
                      </Text>

                      <Text style={[styles.userName, { color: colors.text }]}>
                        {user?.name}
                      </Text>

                      <Text style={[styles.userRole, { color: colors.subText }]}>
                        Welcome back 
                      </Text>
                    </View>
                  </View>
          <View style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
            <Ionicons name="cube-outline" size={80} color={colors.subText} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              No Assigned Assets
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.subText }]}>
              You don’t have any assets assigned yet.
            </Text>
          </View>
          </ScrollView>
        );
      }


  return (

      <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
              data={filteredAssets}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} colors={[colors.primary]}></RefreshControl> }
              numColumns={2}
              keyExtractor={(item) => item.id.toString()}
              columnWrapperStyle={filteredAssets.length > 0 ?{ justifyContent: "space-between" } : undefined}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={
                <>
                  <View style={styles.profileHeader}>
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>
                        {user?.name?.charAt(0)?.toUpperCase()}
                      </Text>
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text style={[styles.companyName, { color: colors.subText }]}>
                        AGGA.IO IT Asset System
                      </Text>

                      <Text style={[styles.userName, { color: colors.text }]}>
                        {user?.name}
                      </Text>

                      <Text style={[styles.userRole, { color: colors.subText }]}>
                        Welcome back 
                      </Text>
                    </View>
                  </View>

                  <View style={styles.statsRow}>
                    <View style={[styles.statCard, { backgroundColor: colors.card }]}>
                      <Text style={[styles.statTitle, { color: colors.subText }]}>TOTAL</Text>
                      <Text style={[styles.statNumber, { color: colors.primary }]}>{assets.length}</Text>
                    </View>
                    <View style={[styles.statCard, { backgroundColor: colors.card }]}>
                      <Text style={[styles.statTitle, { color: colors.subText }]}>REPAIR</Text>
                      <Text style={[styles.statNumber, { color: colors.primary }]}>
                        {assets.filter(a => a.condition?.toLowerCase() === 'repair').length}
                      </Text>
                    </View>
                    <View style={[styles.statCard, { backgroundColor: colors.card }]}>
                      <Text style={[styles.statTitle, { color: colors.subText }]}>ASSIGNED</Text>
                      <Text style={[styles.statNumber, { color: colors.primary }]}>{assets.length}</Text>
                    </View>
                  </View>

                  <View style={styles.sectionRow}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Assigned Assets</Text>
                  </View>

                  <View style={styles.searchRow}>
                    <View style={[styles.searchContainer, { backgroundColor: colors.card }]}>
                      <Ionicons name="search" size={20} color={colors.subText} />
                      <TextInput
                        placeholder="Search assets by name or SN..."
                        placeholderTextColor={colors.subText}
                        style={[styles.searchInput, { color: colors.text }]}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                      />
                    </View>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => setShowCategories(!showCategories)}
                      style={[styles.filterButton, { backgroundColor: showCategories ? colors.primary : colors.card }]}
                    >
                      <Ionicons name="options-outline" size={22} color={showCategories ? "white" : colors.text} />
                    </TouchableOpacity>
                  </View>

                  {showCategories && (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesContainer}>
                      {categoryList.map((item) => (
                        <TouchableOpacity
                          key={item.id.toString()}
                          onPress={() => setSelectedCategory(item.name)}
                          style={[styles.categoryButton, { backgroundColor: selectedCategory === item.name ? colors.primary : (isDark ? "#334155" : "#E8EAF6") }]}
                        >
                          <Text style={{ color: selectedCategory === item.name ? "white" : colors.subText }}>
                            {item.name}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  )}
                </>
              }
              ListEmptyComponent={
                  <View style={styles.inlineEmptyContainer}>
                    <Ionicons name="search-outline" size={44} color={colors.subText} style={{ opacity: 0.6 }} />
                    <Text style={[styles.inlineEmptyText, { color: colors.subText }]}>
                      No assigned asset for {selectedCategory === "All" ? "your search match" : selectedCategory}
                    </Text>
                  </View>
                }
              renderItem={({ item }) => (
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => {
                    router.push({ pathname: "/(main)/assetsDetail", params: { id: item.id } });
                  }}
                  style={[styles.assetGridCard, { backgroundColor: colors.card }]}
                >
                  <Image source={{ uri: normalizeImageUrl(item.image_url) }} style={styles.assetImage} resizeMode="contain" />
                  <Text numberOfLines={1} style={[styles.gridAssetName, { color: colors.text }]}>
                    {item.name}
                  </Text>
                  <View style={styles.assetInfoRow}>
                    <View style={styles.conditionBadge}>
                      <Text style={styles.conditionText}>{item.condition}</Text>
                    </View>
                    <View style={styles.availableBadge}>
                      <Text style={styles.availableText}>{item.status}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            />
      </View>
  
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F3FF",
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111",
  },


  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    marginBottom: 15,
  },

  statCard: {
    backgroundColor: "white",
    width: "31%",
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: "center",
  },

  statTitle: {
    color: "#777",
    fontSize: 12,
    fontWeight: "600",
  },

  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0070EB",
    marginTop: 10,
  },

  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#111",
  },
  searchRow: {
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 12,
},
  searchContainer: {
  flex: 1,
  flexDirection: "row",
  alignItems: "center",
  borderRadius: 16,
  paddingHorizontal: 14,
  height: 50,
},

  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
  },

filterButton: {
  width: 50,
  height: 50,
  borderRadius: 16,
  marginLeft: 12,
  justifyContent: "center",
  alignItems: "center",
},

  categoriesContainer: {
  paddingVertical: 14,
  paddingRight: 10,
  marginTop: -6,
  marginBottom: -6,
},

categoryButton: {
  height: 38,
  backgroundColor: "#E8EAF6",
  paddingHorizontal: 15,
  borderRadius: 20,
  marginRight: 10,
  justifyContent: "center",
  alignItems: "center",
},

  activeCategoryButton: {
    backgroundColor: "#0070EB",
  },

  categoryText: {
  color: "#666",
  fontWeight: "600",
  fontSize: 14,
},

  activeCategoryText: {
    color: "white",
  },

  assetGridCard: {
  width: "48%",
  borderRadius: 22,
  padding: 10,
  marginBottom: 10,
},

assetImage: {
  width: "100%",
  height: 120,
  marginBottom: 7,
},

gridAssetName: {
  fontSize: 15,
  fontWeight: "700",
  marginBottom: 10,
},

assetInfoRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
},

availableBadge: {
  backgroundColor: "#DCFCE7",
  alignSelf: "flex-start",
  paddingHorizontal: 10,
  paddingVertical: 5,
  borderRadius: 30,
},

availableText: {
  color: "#16A34A",
  fontSize: 11,
  fontWeight: "700",
},

conditionBadge: {
  backgroundColor: "#F3F4F6",
  paddingHorizontal: 10,
  paddingVertical: 5,
  borderRadius: 30,
},

conditionText: {
  color: "#6B7280",
  fontSize: 11,
  fontWeight: "700",
},

  assetCard: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 14.5,
    marginBottom: 13,
    borderLeftWidth: 5,
  },

  assetTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  iconContainer: {
    width: 54,
    height: 54,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  statusBadge: {
    backgroundColor: "#D1FAE5",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 30,
  },

  statusText: {
    color: "#059669",
    fontWeight: "700",
    fontSize: 12,
  },

  assetName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
    marginTop: 15,
    marginBottom:19,
  },

  infoRow: {
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  infoLabel: {
    fontSize: 11,
    color: "#888",
    fontWeight: "700",
    marginBottom: 4,
  },

  infoValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
  },
  stateContainer: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  paddingHorizontal: 30,
},
stateTitle: {
  fontSize: 22,
  fontWeight: "700",
  marginTop: 16,
},

emptyContainer: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  paddingHorizontal: 30,
},

emptyTitle: {
  fontSize: 20,
  fontWeight: "700",
  marginTop: 12,
},

emptySubtitle: {
  fontSize: 14,
  textAlign: "center",
  marginTop: 6,
},
inlineEmptyContainer: {
  alignItems: "center",
  justifyContent: "center",
  paddingVertical: 60,
},
inlineEmptyText: {
  fontSize: 15,
  fontWeight: "600",
  textAlign: "center",
  marginTop: 10.5,
},
profileHeader: {
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 16,
  gap: 12,
},

avatar: {
  width: 42,
  height: 42,
  borderRadius: 21,
  backgroundColor: "#0070EB",
  justifyContent: "center",
  alignItems: "center",
},

avatarText: {
  color: "white",
  fontWeight: "bold",
  fontSize: 14.5,
},

companyName: {
  fontSize: 12,
  fontWeight: "600",
},

userName: {
  fontSize: 18,
  fontWeight: "700",
},

userRole: {
  fontSize: 12,
  marginTop: 2,
},
});