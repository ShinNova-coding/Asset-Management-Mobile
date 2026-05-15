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

import { useTheme } from "@/src/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";

const categories = [
  "All",
  "Laptops",
  "Mobile",
  "Accessories",
];

const assets = [
  {
    id: 1,
    name: "MacBook Pro M3",
    serial: "IT-2024-8842",
    status: "Assigned",
    warranty: "Warranty Active",
    image:
      "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?q=80&w=800",
  },

  {
    id: 2,
    name: "iPhone 15 Pro",
    serial: "IT-2024-1109",
    status: "Maintenance",
    warranty: "Exp: Oct 2025",
    image:
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=800",
  },

  {
    id: 3,
    name: "iPad Air",
    serial: "IT-2023-9901",
    status: "Assigned",
    warranty: "Warranty Active",
    image:
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=800",
  },
];

export default function AssetsScreen() {

  const {colors, isDark }= useTheme();
  const [selectedCategory, setSelectedCategory] = useState("All");

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>

      {/* Title */}
      <Text style={[styles.title, { color: colors.text }]}>
        My Assets
      </Text>

      <Text style={styles.subtitle}>
        Manage and track your assigned hardware.
      </Text>

      {/* Search */}
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
        />
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
        >
        {categories.map((item) => {
          const active = selectedCategory === item;

          return (
            <TouchableOpacity
              key={item}
              onPress={() =>setSelectedCategory(item)}
              style={[
                styles.categoryButton,
                { backgroundColor: selectedCategory === item ? colors.primary : (isDark ? "#334155" : "#E8EAF6") }
              ]}
            >
              <Text
                style={{ color: selectedCategory === item ? "white" : colors.subText }}
              >
                {item}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Asset List */}
      <FlatList
        data={assets}
        keyExtractor={(item) =>
          item.id.toString()
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
              router.push(
                `/(tabs)/assets/${item.id}`
              )
            }>

            {/* Image */}
            <Image
              source={{ uri: item.image }}
              style={styles.assetImage}
            />

            {/* Content */}
            <View style={styles.assetContent}>

              <View style={styles.topRow}>

                <Text style={[styles.assetName,{color: colors.text}]}>
                  {item.name}
                </Text>

                <View
                  style={[
                    styles.statusBadge,
                    item.status ===
                    "Maintenance"? styles.maintenanceBadge : styles.assignedBadge,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      item.status ===
                      "Maintenance"? styles.maintenanceText : styles.assignedText,
                    ]}
                  >
                    {item.status}
                  </Text>
                </View>

              </View>

              <Text style={styles.serial}>
                SN: {item.serial}
              </Text>

              <View style={styles.bottomRow}>

                <View style={styles.warrantyRow}>
                  <Ionicons
                    name="refresh-circle-outline"
                    size={16}
                    color="#777"
                  />

                  <Text style={styles.warranty}>
                    {item.warranty}
                  </Text>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={22}
                  color="#999"
                />

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
    paddingTop: 20,
  },

  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#1E1E1E",
  },

  subtitle: {
    color: "#666",
    marginTop: 6,
    marginBottom: 20,
    fontSize: 15,
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 56,
  },

  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
  },

categoryButton: {
  height: 38,
  backgroundColor: "#E8EAF6",
  paddingHorizontal: 18,
  borderRadius: 20,
  marginRight: 10,
  justifyContent: "center",
  alignItems: "center",
},

  activeCategoryButton: {
    backgroundColor: "#4F46E5",
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
    marginBottom: 18,
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
    fontSize: 20,
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

  maintenanceBadge: {
    backgroundColor: "#CFFAFE",
  },

  statusText: {
    fontSize: 11,
    fontWeight: "700",
  },

  assignedText: {
    color: "#059669",
  },

  maintenanceText: {
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
categoriesContainer: {
  paddingVertical: 18,
  paddingRight: 10,
},
});