import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useTheme } from "@/src/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const assets = [
  {
    id: 1,
    name: "MacBook Pro 16”",
    serial: "C02FX5G...MD6M",
    due: "Sep 2025",
    status: "ACTIVE",
    icon: "laptop-outline",
    color: "#5B4BFF",
  },

  {
    id: 2,
    name: "iPad Pro 12.9\"",
    serial: "DLXCQ5J...F16P",
    due: "Jun 2024",
    status: "ACTIVE",
    icon: "tablet-portrait-outline",
    color: "#36D7FF",
  },
];

export default function DashboardScreen() {
  const {colors, isDark} = useTheme();
  return (
    <ScrollView style={[styles.container, {backgroundColor: colors.background}]}>

      {/* Header */}
      <Text style={[styles.header,{color: colors.text}]}>
        Hello, Alex 
      </Text>
      <Text style={[styles.subheader,{color: colors.subText}]}>
        Here is your hardware inventory overview.
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
          <Text style={[styles.statTitle,{color: colors.subText}]}>ACTIVE</Text>
          <Text style={[styles.statNumber,{color: colors.primary}]}>3</Text>
        </View>
      </View>

      <View style={styles.sectionRow}>

        <Text style={[styles.sectionTitle, {color: colors.text}]}>
          Assigned Assets
        </Text>

        <TouchableOpacity
          onPress={() => router.push("/(tabs)/assets")}
        >
          <Text style={styles.viewAll}>
            View All
          </Text>
        </TouchableOpacity>

      </View>

      {/* Assets */}
      <FlatList
        data={assets}
        scrollEnabled={false}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
          onPress={()=> {}}
            style={[
              styles.assetCard,{backgroundColor: colors.card},{ borderLeftColor: item.color },
            ]}
          >

            <View style={styles.assetTopRow}>

              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: `${item.color}15` },
                ]}
              >
                <Ionicons
                  name={item.icon as any}
                  size={28}
                  color={item.color}
                />
              </View>

              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>
                  {item.status}
                </Text>
              </View>

            </View>

            {/* Asset Name */}
            <Text style={[styles.assetName,{color: colors.text}]}>
              {item.name}
            </Text>

            <View style={styles.infoRow}>

              <View>
                <Text style={styles.infoLabel}>
                  SERIAL NO
                </Text>

                <Text style={[styles.infoValue,{color: colors.text}]}>
                  {item.serial}
                </Text>
              </View>

              <View>
                <Text style={styles.infoLabel}>
                  DUE DATE
                </Text>

                <Text style={[styles.infoValue,{color: colors.text}]}>
                  {item.due}
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
    fontSize: 28,
    fontWeight: "bold",
    color: "#111",
  },

  subheader: {
    color: "#666",
    marginTop: 6,
    marginBottom: 24,
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
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
    fontSize: 28,
    fontWeight: "bold",
    color: "#4F46E5",
    marginTop: 10,
  },

  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111",
  },

  viewAll: {
    color: "#4F46E5",
    fontWeight: "700",
  },

  assetCard: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 18,
    marginBottom: 18,
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
    fontSize: 24,
    fontWeight: "bold",
    color: "#222",
    marginTop: 18,
    marginBottom: 22,
  },

  infoRow: {
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
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
});