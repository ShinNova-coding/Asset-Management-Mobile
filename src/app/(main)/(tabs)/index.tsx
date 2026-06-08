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
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { API_URL } from "../../../api/client";
import DashboardSkeleton from "../../../components/skeletons/DashboardSkeleton";

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
   const {user } = useAuth();
   const {colors, isDark} = useTheme();
   const [assets, setAssets] = useState<Asset[]>([]);
   const [emp, setEmp] = useState<any>(null);
   const [categories, setCategories ] = useState<any[]>([]);
   const [selectedCategory, setSelectedCategory] = useState("All");
   const [loading, setLoading] = useState(true);
   const [searchQuery, setSearchQuery] = useState("");
   const [showCategories, setShowCategories] = useState(false);

  const filteredAssets = assets.filter((item) => {
  const query = searchQuery.toLowerCase();

  const matchesSearch =
    item.name.toLowerCase().includes(query) ||
    item.serial_number.toLowerCase().includes(query);

  const matchesCategory =
    selectedCategory === "All" ||
    item.category?.name === selectedCategory;

  return matchesSearch && matchesCategory;
});
   const categoryList = [{ id: 0, name: "All" }, ...(categories?? [])];
          
   console.log("DASHBOARD USER:", user);

useEffect(() => {
    async function loadAssets() {
      if (!user || !user.id || typeof user.id !== 'string') {
        console.log("Dashboard rendering paused: Awaiting valid User Profile initialization context.");
        return;
      }

      try {
        setLoading(true);
        const [assignedAssets, resCategories] = await Promise.all([
          getAssignedAssets(),
          getCategories()
        ]);

        const mappedAssets = (assignedAssets || []).map((asset: any) => ({
          ...asset,
          asset_id: asset.id || asset.asset_code, 
        }));

        setAssets(mappedAssets);
        setCategories(Array.isArray(resCategories) ? resCategories : []);
      } catch (error) {
        console.log("LOAD ONLINE ASSETS ERROR:", error);
      } finally {
        setLoading(false);
      }
    }

    loadAssets();
  }, [user]);

    if (loading) {
  return <DashboardSkeleton />;
}

  return (


<View style={[styles.container, { backgroundColor: colors.background }]}>
<FlatList
        data={filteredAssets}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <Text style={[styles.header, { color: colors.text, marginTop: 16 }]}>
              {user?.name}
            </Text>

            <View style={styles.statsRow}>
              <View style={[styles.statCard, { backgroundColor: colors.card }]}>
                <Text style={[styles.statTitle, { color: colors.subText }]}>TOTAL</Text>
                <Text style={[styles.statNumber, { color: colors.primary }]}>{filteredAssets.length}</Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: colors.card }]}>
                <Text style={[styles.statTitle, { color: colors.subText }]}>REPAIR</Text>
                <Text style={[styles.statNumber, { color: colors.primary }]}>
                  {filteredAssets.filter(a => a.condition?.toLowerCase() === 'repair').length}
                </Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: colors.card }]}>
                <Text style={[styles.statTitle, { color: colors.subText }]}>ASSIGNED</Text>
                <Text style={[styles.statNumber, { color: colors.primary }]}>{filteredAssets.length}</Text>
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

            {/* Horizontal Filter Categories Scroll */}
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
});