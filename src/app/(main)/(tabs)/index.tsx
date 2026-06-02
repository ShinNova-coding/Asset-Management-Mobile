import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import { useAuth } from "@/src/context/AuthContext";
import { useTheme } from "@/src/context/ThemeContext";
import { getAssets } from "@/src/services/asset.service";
import { getCategories } from "@/src/services/category.service";
import { router } from "expo-router";
import { useEffect, useState } from "react";

type Asset = {
  asset_id: string;
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

export default function DashboardScreen() {
   const {user } = useAuth();
   const {colors, isDark} = useTheme();
   const [assets, setAssets] = useState<Asset[]>([]);
   const [categories, setCategories ] = useState<any[]>([]);
   const [selectedCategory, setSelectedCategory] = useState("All");
   const [loading, setLoading] = useState(false);

   const filteredAssets = selectedCategory === "All" ? assets : assets.filter((item) =>item.category?.name === selectedCategory);
   const categoryList = [{ id: 0, name: "All" }, ...(categories?? [])];
          
   console.log("DASHBOARD USER:", user);

    useEffect(() => {
    
      async function loadAssets() {
    
        try {
    
          setLoading(true);

          const resAssets= await getAssets();
          setAssets(resAssets || []);
          // console.log( "ONLINE ASSETS:",resAssets);
    
          const resCategory = await getCategories();
          setCategories(Array.isArray(resCategory) ? resCategory : []);
          console.log("ONLINE CATEGORIES", resCategory);
    
        } catch (error) {   
          console.log(
            "LOAD API ERROR:",
            error
          );
    
        } finally {
          setLoading(false);
        }
      }
    
      loadAssets();
    
    }, []);

  return (
    <ScrollView style={[styles.container, {backgroundColor: colors.background}]}>

      <Text style={[styles.header,{color: colors.text}]}>
        {user?.name}
      </Text>

      <View style={styles.statsRow}>
        <View style={[styles.statCard,{backgroundColor: colors.card}]}>
          <Text style={[styles.statTitle,{color: colors.subText}]}>TOTAL</Text>
          <Text style={[styles.statNumber,{color: colors.primary}]}>4</Text>
        </View>

        <View style={[styles.statCard,{backgroundColor: colors.card}]}>
          <Text style={[styles.statTitle,{color: colors.subText}]}>REPAIR</Text>
          <Text style={[styles.statNumber,{color: colors.primary}]}>1</Text>
        </View>

        <View style={[styles.statCard,{backgroundColor: colors.card}]}>
          <Text style={[styles.statTitle,{color: colors.subText}]}>ASSIGNED</Text>
          <Text style={[styles.statNumber,{color: colors.primary}]}>3</Text>
        </View>
      </View>

      <View style={styles.sectionRow}>
      <Text
        style={[
          styles.sectionTitle,
          { color: colors.text },
        ]}
      >
        Available Assets
      </Text>
     </View>
      <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
        >
        {categoryList.map((item) => {
          const active = selectedCategory === item.name;

          return (
            <TouchableOpacity
              key={item.id.toString()}
              onPress={() =>setSelectedCategory(item.name)}
              style={[
                styles.categoryButton,
                { backgroundColor: selectedCategory === item.name ? colors.primary : (isDark ? "#334155" : "#E8EAF6") }
              ]}
            >
              <Text
                style={{ color: selectedCategory === item.name ? "white" : colors.subText }}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      </View>

<FlatList
  data={filteredAssets}
  numColumns={2}
  scrollEnabled={false}
  columnWrapperStyle={{
    justifyContent: "space-between",
  }}
  keyExtractor={(item) => item.asset_id.toString()}
  renderItem={({ item }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => {
        router.push({
          pathname: "/(main)/assetsDetail",
          params: { asset: JSON.stringify(item), mode: "available"},
        });
      }}
      style={[
        styles.assetGridCard,
        {
          backgroundColor: colors.card,
        },
      ]}
    >
      <Image
        source={{ uri: item.image_url || undefined }}
        style={styles.assetImage}
        resizeMode="contain"
      />

      <Text
        numberOfLines={1}
        style={[
          styles.gridAssetName,
          { color: colors.text },
        ]}
      >
        {item.name}
      </Text>

      <View style={styles.assetInfoRow}>
        <View style={styles.conditionBadge}>
          <Text style={styles.conditionText}>
            {item.condition}
          </Text>
        </View>
        <View style={styles.availableBadge}>
          <Text style={styles.availableText}>
            {item.status === "available" ? "Available" : "Assigned"}
          </Text>
        </View>
      </View>

    </TouchableOpacity>
  )}
/>
    </ScrollView>
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
    marginBottom: 20,
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
    marginBottom: 5,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#111",
  },

  categoriesContainer: {
  paddingVertical: 14,
  paddingRight: 10,
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
});