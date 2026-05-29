import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

import { useTheme } from "@/src/context/ThemeContext";
import { getAssets } from "@/src/services/asset.service";
import { getCategories } from "@/src/services/category.service";
import { Ionicons } from "@expo/vector-icons";
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

export default function AssetsScreen() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const {colors, isDark }= useTheme();
  const [categories, setCategories ] = useState<any[]>([]);
  const [showCategories, setShowCategories] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
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

useEffect(() => {

  async function loadAssets() {

    try {

      setLoading(true);

      const resAssets = await getAssets();
      setAssets(resAssets || []);
      console.log( "ONLINE ASSETS:",resAssets);

      const resCategories = await getCategories();
      setCategories(Array.isArray(resCategories) ? resCategories : []);

      console.log("ONLINE CATEGORIES", resCategories);

    } catch (error) {

      console.log(
        "LOAD ONLINE ASSETS ERROR:",
        error
      );

    } finally {

      setLoading(false);
    }
  }

  loadAssets();

}, []);
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>

      <Text style={[styles.title, { color: colors.text }]}>
        My Assets
      </Text>
      <Text style={[styles.subtitle, {color: colors.subText}]}>
        Manage and track your assigned hardware.
      </Text>

    <View style= {styles.searchRow}>
      <View style={[styles.searchContainer, { backgroundColor: colors.card }]}>
        <Ionicons
          name="search"
          size={20}
          color={colors.subText}
        />
        <TextInput
          placeholder="Search assets by name or SN..."
          placeholderTextColor={colors.subText}
          style={[styles.searchInput, { color: colors.text }]}
          value= {searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
          <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            setShowCategories(!showCategories)
          }
          style={[
            styles.filterButton,
            {
              backgroundColor: showCategories
                ? colors.primary
                : colors.card,
            },
          ]}
          >
          <Ionicons
            name="options-outline"
            size={22}
            color={
              showCategories
                ? "white"
                : colors.text
            }
          />
        </TouchableOpacity>
      </View>

      <View>
        {showCategories && (
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
        </ScrollView> )}
      </View>
      
      <View>
      <FlatList
              data={filteredAssets}
              keyExtractor={(item) =>
                item.asset_id
              }
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingBottom: 20,
              }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  activeOpacity={0.9}
                  style={[styles.assetCard, { backgroundColor: colors.card }]}
                  onPress={() =>
                    router.push({
                      pathname: "/(main)/assetsDetail",
                      params: { id: item.asset_id, mode: "assigned"},
                    })
                  }
                >
                  <Image source={{ uri: item.image_url || undefined }} style={styles.assetImage} /> 

                  <View style={styles.assetContent}>
                    <View style={styles.topRow}>
                      <Text style={[styles.assetName, { color: colors.text }]}>{item.name}</Text>

                      <View
                        style={[
                          styles.statusBadge,
                          item.status === "available"
                            ? styles.availableBadge
                            : styles.assignedBadge,
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusText,
                            item.status === "available"
                              ? styles.availableText
                              : styles.assignedText,
                          ]}
                        >
                          {item.status}
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.serial}>SN: {item.serial_number}</Text>

                    <View style={styles.bottomRow}>
                      <View style={styles.warrantyRow}>
                        <Ionicons name="refresh-circle-outline" size={16} color="#777" />
                        <Text style={styles.warranty}>Exp: {item.warranty_period}</Text>
                      </View>

                      <Ionicons name="chevron-forward" size={22} color="#999" />
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            />
            </View>

      {/* <FlatList
        data={assets}
        keyExtractor={(item) =>
          item.asset_id.toString()
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 30,
        }}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.9}
            style={[styles.assetCard, { backgroundColor: colors.card }]}
            onPress={() =>
              router.push({
                pathname: "/(main)/assetsDetail",
                params: { id: item.asset_id },
              })
            }
          >
            <Image source={{ uri: item.image || "https://via.placeholder.com/150" }} style={styles.assetImage} /> 

            <View style={styles.assetContent}>
              <View style={styles.topRow}>
                <Text style={[styles.assetName, { color: colors.text }]}>{item.name}</Text>

                <View
                  style={[
                    styles.statusBadge,
                    item.status === "available"
                      ? styles.availableBadge
                      : styles.assignedBadge,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      item.status === "available"
                        ? styles.availableText
                        : styles.assignedText,
                    ]}
                  >
                    {item.status}
                  </Text>
                </View>
              </View>

              <Text style={styles.serial}>SN: {item.serial_number}</Text>

              <View style={styles.bottomRow}>
                <View style={styles.warrantyRow}>
                  <Ionicons name="refresh-circle-outline" size={16} color="#777" />
                  <Text style={styles.warranty}>Exp: {item.warranty_expiry}</Text>
                </View>

                <Ionicons name="chevron-forward" size={22} color="#999" />
              </View>
            </View>
          </TouchableOpacity>
        )}
      /> */}
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

  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1E1E1E",
  },

  subtitle: {
    color: "#666",
    marginTop: 6,
    marginBottom: 20,
    fontSize: 14,
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

  searchRow: {
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 4,
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
  paddingVertical: 10.5,
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

  assetCard: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 14,
    marginTop: 11.5,
    flexDirection: "row",
    alignItems: "center",
  },

  assetImage: {
    width: 82,
    height: 82,
    borderRadius: 18,
    backgroundColor: "#EEE",
  },

  assetContent: {
    flex: 1,
    marginLeft: 14,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  assetName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2A2A2A",
    flex: 1,
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginLeft: 10,
  },

  assignedBadge: {
    backgroundColor: "#D1FAE5",
  },

  availableBadge: {
    backgroundColor: "#CFFAFE",
  },

  statusText: {
    fontSize: 11,
    fontWeight: "700",
  },

  assignedText: {
    color: "#059669",
  },

  availableText: {
    color: "#0891B2",
  },

  serial: {
    color: "#777",
    marginTop: 8,
    fontSize: 15,
    fontWeight: "500",
  },

  bottomRow: {
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  warrantyRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  warranty: {
    marginLeft: 4,
    color: "#666",
    fontWeight: "600",
  },

});