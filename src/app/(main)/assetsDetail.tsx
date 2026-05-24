import HeaderBar from "@/src/components/HeaderBar";
import { useTheme } from "@/src/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
    {
    id: 4,
    name: "Chair",
    serial: "IT-2023-9901",
    status: "Assigned",
    warranty: "Warranty Active",
    image:
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=800",
  },
  
  {
    id: 5,
    name: "iPad Air",
    serial: "IT-2023-9901",
    status: "Assigned",
    warranty: "Warranty Active",
    image:
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=800",
  },
  {
      id: 7,
    name: "MacBook Pro 16”",
    serial: "C02FX5G...MD6M",
    warranty: "Sep 2025",
    status: "ACTIVE",
    icon: "laptop-outline",
    color: "#5B4BFF",
  },

  {
    id: 8,
    name: "iPad Pro 12.9\"",
    serial: "DLXCQ5J...F16P",
    warranty: "Jun 2024",
    status: "ACTIVE",
    icon: "tablet-portrait-outline",
    color: "#36D7FF",
  },
];

export default function AssetDetailScreen() {
  const {colors, isDark} = useTheme();
  const { id, mode } = useLocalSearchParams();
  const router = useRouter();


  const asset = assetsData.find((a) => a.id === Number(id));
  const [status, setStatus] = useState (asset?.status || "");
  const handleReturn = () => {
    Alert.alert(
      "Return Asset",
      "Are you sure to return this asset?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Return",
          onPress: () => {
            setStatus("Returned");

            Alert.alert(
              "Success",
              "Asset returned successfully."
            );
          },
        },
      ]
    );
  };

  if (!asset) {
    return (
      <View style={styles.container}><Text>Asset not found</Text></View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <HeaderBar title="Asset Details" backButtonAction={()=> router.back()}/>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>       
      
        <View style={[styles.imageCard, { backgroundColor: colors.card }]}>
          <Image source={{ uri: asset.image }} style={styles.detailImage} resizeMode="contain" />
          <Text style={[styles.mainTitle, { color: colors.text }]}>{asset.name}</Text>
          <Text style={[styles.subTitle, { color: colors.subText }]}>SN-{asset.serial}</Text>           
          <View style={styles.badgeRow}>
            <View style={[styles.badge, styles.activeBadge]}>
              <Text style={styles.activeBadgeText}>{status}</Text>
            </View>
            <View style={[styles.badge, styles.conditionBadge]}>
              <Text style={styles.conditionBadgeText}>Condition: {asset.condition}</Text>
            </View>
          </View>
        </View>
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
{mode ==="assigned" ? (
  <>

        <TouchableOpacity
          style={[
            styles.returnButton,
            status === "Returned" && {
              backgroundColor: "#9CA3AF",
            },
          ]}
          disabled={status === "Returned"}
          onPress={handleReturn}
        >
          <Ionicons
            name="return-up-back-outline"
            size={20}
            color="white"
          />

          <Text style={styles.reportButtonText}>
            {status === "Returned"? "Returned": "Return"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.reportButton}
          onPress={() =>
            router.push({
              pathname: "/(main)/reportIssue",
              params: { id: asset.id },
            })
          }
        >
          <Ionicons name="warning-outline" size={20} color="white" />
          <Text style={styles.reportButtonText}>Report an Issue</Text>
        </TouchableOpacity>
        </>
) : (

         <TouchableOpacity
          style={styles.requestButton}
          onPress={() => {
            alert("Asset request submitted");
          }}
           >
          <Ionicons
            name="add-circle-outline"
            size={20}
            color="white"
           />

          <Text style={styles.reportButtonText}>
            Request Asset
          </Text>
          </TouchableOpacity>
          )}
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
    padding: 3,
    alignItems: "center",
    marginBottom: 16,
  },
  detailImage: { width: 200, height: 200, marginBottom: -3 },
  mainTitle: { fontSize: 24, fontWeight: "bold", color: "#1E1E1E" },
  subTitle: { color: "#888", marginBottom: 15 },
  badgeRow: { flexDirection: "row", gap: 8, paddingBottom: 12 },
  badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  activeBadge: { backgroundColor: "#0070EB" },
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
  avatarText: { color: "#0070EB", fontWeight: "bold" },
  reportButton: {
    backgroundColor: "#0070EB",
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
  sectionTitle: { fontSize: 17, fontWeight: "bold", marginBottom: 15 },
  historyItem: { flexDirection: "row", gap: 12 },
  timeline: { width: 2, backgroundColor: "#0070EB", marginVertical: 4 },
  historyName: { fontWeight: "600", fontSize: 15 },
  historyDate: { color: "#888", fontSize: 13 },
  returnButton: {
  backgroundColor: "#F59E0B",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  padding: 16,
  borderRadius: 16,
  gap: 8,
  marginBottom: 12,
},
requestButton: {
  backgroundColor: "#10B981",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  padding: 16,
  borderRadius: 16,
  gap: 8,
  marginBottom: 20,
},

reportIssueButton: {
  backgroundColor: "#EF4444",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  padding: 16,
  borderRadius: 16,
  gap: 8,
  marginBottom: 20,
},
});