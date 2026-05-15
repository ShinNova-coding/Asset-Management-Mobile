import { useTheme } from "@/src/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Mock data (replace with API call later)
const assetsData = [
  {
    id: 1,
    name: "MacBook Pro M3",
    serial: "IT-2024-8842",
    status: "Active",
    condition: "Excellent",
    category: "Laptop",
    warranty: "Oct 2026",
    assignedTo: "Sarah Jenkins",
    image: "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?q=80&w=800",
  },
  {
    id: 2,
    name: "iPhone 15 Pro",
    serial: "IT-2024-1109",
    status: "Active",
    condition: "Good",
    category: "Phone",
    warranty: "Oct 2025",
    assignedTo: "Sarah Jenkins",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=800",
  },
    {
    id: 3,
    name: "iPad Air",
    serial: "IT-2024-1109",
    status: "Active",
    condition: "Repair",
    category: "Phone",
    warranty: "Oct 2025",
    assignedTo: "kmo",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=800",
  },
];

export default function AssetDetailScreen() {
  const {colors, isDark} = useTheme();
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // Find the specific asset based on the ID from the URL
  const asset = assetsData.find((a) => a.id === Number(id));

  if (!asset) {
    return (
      <View style={styles.container}><Text>Asset not found</Text></View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header with Back Arrow */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Asset Details</Text>
        <View style={{ width: 40 }} /> 
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>       
        {/* Asset Image Card */}
        <View style={[styles.imageCard, { backgroundColor: colors.card }]}>
          <Image source={{ uri: asset.image }} style={styles.detailImage} resizeMode="contain" />
          <Text style={[styles.mainTitle, { color: colors.text }]}>{asset.name}</Text>
          <Text style={[styles.subTitle, { color: colors.subText }]}>SN-{asset.serial}</Text>
           {/* active Bar */}
          <View style={styles.badgeRow}>
            <View style={[styles.badge, styles.activeBadge]}>
              <Text style={styles.activeBadgeText}>{asset.status}</Text>
            </View>
            <View style={[styles.badge, styles.conditionBadge]}>
              <Text style={styles.conditionBadgeText}>Condition: {asset.condition}</Text>
            </View>
          </View>
        </View>

        {/* Info Grid (Category & Warranty) */}
        <View style={styles.infoGrid}>
          <View style={[styles.infoBox, { backgroundColor: colors.card }]}>
            <Text style={styles.infoLabel}>Category</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>{asset.category}</Text>
          </View>
          <View style={[styles.infoBox, { backgroundColor: colors.card }]}>
            <Text style={styles.infoLabel}>Warranty</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>{asset.warranty}</Text>
          </View>
        </View>

        {/* Assigned To Section */}
        <View style={[styles.assignmentCard, { backgroundColor: colors.card }]}>
           <View>
              <Text style={styles.infoLabel}>Assigned To</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>{asset.assignedTo}</Text>
           </View>
           <View style={styles.avatar}>
              <Text style={styles.avatarText}>SJ</Text>
           </View>
        </View>

        {/* Action Button */}
        <TouchableOpacity style={styles.reportButton}>
          <Ionicons name="warning-outline" size={20} color="white" />
          <Text style={styles.reportButtonText}>Report an Issue</Text>
        </TouchableOpacity>

        {/* Assignment History Placeholder */}
        <View style={[styles.historyCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Assignment History</Text>
          <View style={styles.historyItem}>
            <View style={styles.timeline} />
            <View>
              <Text style={[styles.historyName, { color: colors.text }]}>{asset.assignedTo}</Text>
              <Text style={styles.historyDate}>Assigned: Jan 12, 2024</Text>
            </View>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F7FF" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  headerTitle: { fontSize: 18, fontWeight: "600" },
  backButton: { padding: 8 },
  scrollContent: { padding: 16 },
  imageCard: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 20,
    alignItems: "center",
    marginBottom: 16,
  },
  detailImage: { width: 150, height: 150, marginBottom: 15 },
  mainTitle: { fontSize: 24, fontWeight: "bold", color: "#1E1E1E" },
  subTitle: { color: "#888", marginBottom: 15 },
  badgeRow: { flexDirection: "row", gap: 8 },
  badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  activeBadge: { backgroundColor: "#4F46E5" },
  activeBadgeText: { color: "white", fontWeight: "bold", fontSize: 12 },
  conditionBadge: { backgroundColor: "#F3F4F6" },
  conditionBadgeText: { color: "#666", fontSize: 12 },
  infoGrid: { flexDirection: "row", gap: 12, marginBottom: 12 },
  infoBox: { flex: 1, backgroundColor: "white", padding: 16, borderRadius: 16 },
  infoLabel: { color: "#888", fontSize: 12, marginBottom: 4 },
  infoValue: { fontSize: 16, fontWeight: "700", color: "#1E1E1E" },
  assignmentCard: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#D1D5FF", justifyContent: "center", alignItems: "center" },
  avatarText: { color: "#4F46E5", fontWeight: "bold" },
  reportButton: {
    backgroundColor: "#4F46E5",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    gap: 8,
    marginBottom: 20,
  },
  reportButtonText: { color: "white", fontWeight: "bold", fontSize: 16 },
  historyCard: { backgroundColor: "white", padding: 20, borderRadius: 24 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15 },
  historyItem: { flexDirection: "row", gap: 12 },
  timeline: { width: 2, backgroundColor: "#4F46E5", marginVertical: 4 },
  historyName: { fontWeight: "600", fontSize: 15 },
  historyDate: { color: "#888", fontSize: 13 },
});