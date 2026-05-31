import HeaderBar from "@/src/components/HeaderBar";
import { useTheme } from "@/src/context/ThemeContext";
import { getAssetById } from "@/src/services/asset.service";
import { requestAsset, returnAsset } from "@/src/services/request.service";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
type Asset = {
  asset_id: string;
  name: string;
  serial_number: string;
  status: string;
  condition: string;
  category: {
    id: string;
    name: string;
  };
  warranty_period: number;
  image_url: string | null;
};

export default function AssetDetailScreen() {
  const {colors, isDark} = useTheme();
  const { id, mode } = useLocalSearchParams();
  const router = useRouter();
  const [note, setNote] = useState("");
  const [asset, setAsset] = useState<Asset | null>(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {

  async function loadAssetDetail() {

    try {

      setLoading(true);

      const res = await getAssetById(id as string);

      setAsset(res);
      setStatus(res.status);

      console.log("ASSET DETAIL:", res);

    } catch (error) {

      console.log(
        "LOAD ASSET DETAIL ERROR:",
        error
      );

      Alert.alert(
        "Error",
        "Failed to load asset."
      );

    } finally {

      setLoading(false);
    }
  }

  if (id) {
    loadAssetDetail();
  }

}, [id]);

if (loading) {
  return (
    <View style={styles.container}>
      <Text>Loading...</Text>
    </View>
  );
}

if (!asset) {
  return (
    <View style={styles.container}>
      <Text>Asset not found</Text>
    </View>
  );
}

  const handleReturn = async () => {
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
          onPress: async () => {
            try {
              await returnAsset(asset.asset_id);
            setStatus("Returned");

            Alert.alert(
              "Success",
              "Asset returned successfully."
            );
          }catch (error) {
            console.log(error);
            Alert.alert("Error", "Failed to return asset.")
          }
          },
        },
      ]
    );
  };


  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <HeaderBar title="Asset Details" backButtonAction={()=> router.back()}/>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>       
      
        <View style={[styles.imageCard, { backgroundColor: colors.card }]}>
          <Image source={{ uri: asset.image_url || undefined }} style={styles.detailImage} resizeMode="contain" />
          <Text style={[styles.mainTitle, { color: colors.text }]}>{asset.name}</Text>
          <Text style={[styles.subTitle, { color: colors.subText }]}>SN-{asset.serial_number}</Text>           
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
            <Text style={[styles.infoValue, { color: colors.text }]}>{asset.category?.name}</Text>
          </View>
          <View style={[styles.infoBox, { backgroundColor: colors.card }]}>
            <Text style={styles.infoLabel}>Warranty</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>{asset.warranty_period}Months</Text>
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
              params: { id: asset.asset_id },
            })
          }
        >
          <Ionicons name="warning-outline" size={20} color="white" />
          <Text style={styles.reportButtonText}>Report an Issue</Text>
        </TouchableOpacity>
        </>
) : (          <>
                 <Text
                   style={[
                     styles.label,
                     { color: colors.subText },
                   ]}
                 >
                   NOTE FOR ASSET REQUEST
                 </Text>
         
                 <TextInput
                   multiline
                   value={note}
                   onChangeText={setNote}
                   placeholder="Please provide details for your request..."
                   placeholderTextColor={colors.subText}
                   style={[
                     styles.textArea,
                     {
                       backgroundColor: colors.card,
                       color: colors.text,
                       borderColor: isDark
                         ? "#334155"
                         : "#E5E7EB",
                     },
                   ]}
                 />

         <TouchableOpacity
          style={styles.requestButton}
          onPress={async() => {
            if (!note.trim()) {
              Alert.alert( "Required ", "Please enter request note.");
              return;
            }
            try {
              await requestAsset (asset.asset_id, note);
              Alert.alert( "Success", "Asset request submitted.");
              setNote("");
            }catch(error) {
              console.log(error);
                  Alert.alert("Error","Failed to submit request." );
            }
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
          </>
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

   label: {
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 10,
    marginTop: 6,
  },
  textArea: {
    minHeight: 130,
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    textAlignVertical: "top",
    fontSize: 15,
    marginBottom: 22,
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