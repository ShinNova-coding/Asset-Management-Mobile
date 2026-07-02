import HeaderBar from "@/src/components/HeaderBar";
import { useAuth } from "@/src/context/AuthContext";
import { useTheme } from "@/src/context/ThemeContext";
import { getAssetById } from "@/src/services/asset.service";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { API_URL } from "../../api/client";
import AssetDetailSkeleton from "../../components/skeletons/AssetDetailSkeleton";
import { returnAsset } from "../../services/return.service";

type Asset = {
  id: string;
  asset_code: string;
  name: string;
  serial_number: string;

  purchased_date: string;
  warranty_period: number;

  model: string;
  ram_capacity: string;
  storage: string;

  status: string;
  condition: string;

  image_url: string | null;
  preview_url?: string;

  created_at: string;
  updated_at: string;

  category: {
    id: string;
    name: string;
  };
    media?: {
    id: number;
    original_url: string;
    preview_url: string;
  }[];
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

const DetailRow = ({
  label,
  value,
  labelColor = "#64748B",
  valueColor = "#111827",
  borderColor = "#F1F5F9",
}: {
  label: string;
  value: string;
  labelColor?: string;
  valueColor?: string;
  borderColor?: string;
}) => (
  <View style={[styles.detailRow,  { borderBottomColor: borderColor }]}>
    <Text
      style={[
        styles.detailLabel,
        { color: labelColor }
      ]}
    >
      {label}
    </Text>

    <Text
      style={[
        styles.detailValue,
        { color: valueColor }
      ]}
    >
      {value}
    </Text>
  </View>
);

export default function AssetDetailScreen() {
  const {colors, isDark} = useTheme();
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [note, setNote] = useState("");
  const [asset, setAsset] = useState<Asset | null>(null);
  const [status, setStatus] = useState("");
  const isReportDisabled = status.toLowerCase() === "requested" || status.toLowerCase() === "maintenance" || status.toLowerCase() === "returned";
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useFocusEffect(
   useCallback(()=>{
    async function loadAssetDetail() {

      try {

        setLoading(true);

        const res = await getAssetById(id as string);

        // console.log("ASSET DETAIL:", res);
        setAsset(res);
        setStatus(res.status);

      } catch (error) {

        console.log(
          "LOAD ASSET DETAIL ERROR:",
          error
        );
      } finally {
        setLoading(false);
      }
    }
    if (id) {
      loadAssetDetail();
    }
    console.log("ASSET ID:", id);  

    }, [id])
      )
     if (loading) {
        return <AssetDetailSkeleton />;
      }


if (!asset) {
  return (
    <View style={styles.stateContainer}>
      <Ionicons
        name="search-outline"
        size={70}
        color="#9CA3AF"
      />
      <Text style={[
          styles.stateTitle,
          { color: colors.text },
        ]}>Asset not found
      </Text>
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
              await returnAsset(asset.id);
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

      <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >

    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <HeaderBar title="Asset Details" backButtonAction={()=> router.back()}/>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>       
      
        <View style={[styles.imageCard, { backgroundColor: colors.card }]}>
          <View >
          <Image source={{ uri: normalizeImageUrl(asset.image_url) }} style={styles.detailImage} resizeMode="cover" />
          </View>
         <Text style={[styles.mainTitle,{ color: colors.text }]}>{asset.name}</Text>
         <Text style={[styles.assetCode, { color: colors.primary }]}>{asset.asset_code}</Text>
         <Text style={[styles.serialText,{ color: colors.subText }]}>Serial No: {asset.serial_number}</Text>         
          <View style={styles.badgeRow}>
            <View style={[styles.badge, styles.activeBadge]}>
              <Text style={styles.activeBadgeText}>{status}</Text>
            </View>
            <View style={[styles.badge, styles.conditionBadge]}>
              <Text style={styles.conditionBadgeText}>Condition: {asset.condition}</Text>
            </View>
          </View>
        </View>
        <View style={styles.quickStats}>
          <View style={[styles.statCard,{ backgroundColor: colors.card }]}>
            <Ionicons name="cube-outline" size={22} style={ {color: colors.subText}}/>
            <Text style={ {color: colors.subText}}>Category</Text>
            <Text style={ {color: colors.text}}>{asset.category?.name}</Text>
          </View>

          <View style={[styles.statCard,{ backgroundColor: colors.card }]}>
            <Ionicons name="shield-checkmark-outline" size={22} style={ {color: colors.subText}} />
            <Text style={ {color: colors.subText}}>Warranty</Text>
            <Text style={ {color: colors.text}}>{asset.warranty_period}M</Text>
          </View>

          <View style={[styles.statCard,{ backgroundColor: colors.card }]}>
            <Ionicons name="hardware-chip-outline" size={22} style={ {color: colors.subText}} />
            <Text style={ {color: colors.subText}}>RAM</Text>
            <Text style={ {color: colors.text}}>{asset.ram_capacity}</Text>
          </View>

          <View style={[styles.statCard,{ backgroundColor: colors.card }]}>
            <Ionicons name="save-outline" size={22} style={ {color: colors.subText}} />
            <Text style={ {color: colors.subText}}>Storage</Text>
            <Text  style={ {color: colors.text}}>{asset.storage}</Text>
          </View>
        </View>
        <View
          style={[
            styles.sectionCard,
            { backgroundColor: colors.card }
          ]}
        >
          <Text
            style={[
              styles.sectionTitle,
              { color: colors.text }
            ]}
          >
            Asset Information
          </Text>

          <DetailRow
            label="Asset Code"
            value={asset.asset_code}
            labelColor={colors.subText}
            valueColor={colors.text}
            borderColor={colors.border}
          />

          <DetailRow
            label="Serial Number"
            value={asset.serial_number}
            labelColor={colors.subText}
            valueColor={colors.text}
            borderColor={colors.border}
          />

          <DetailRow
            label="Category"
            value={asset.category?.name ?? "N/A"}
            labelColor={colors.subText}
            valueColor={colors.text}
            borderColor={colors.border}
          />

          <DetailRow
            label="Model"
            value={asset.model || "N/A"}
            labelColor={colors.subText}
            valueColor={colors.text}
            borderColor={colors.border}
          />
        </View>
        <View
          style={[
            styles.sectionCard,
            { backgroundColor: colors.card }
          ]}
        >
          <Text
            style={[
              styles.sectionTitle,
              { color: colors.text }
            ]}
          >
            Hardware Specifications
          </Text>

          <DetailRow
            label="RAM"
            value={asset.ram_capacity || "N/A"}
            labelColor={colors.subText}
            valueColor={colors.text}
            borderColor={colors.border}
          />

          <DetailRow
            label="Storage"
            value={`${asset.storage} GB`}
            labelColor={colors.subText}
            valueColor={colors.text}
            borderColor={colors.border}
          />
        </View>
        <View
  style={[
    styles.sectionCard,
    { backgroundColor: colors.card }
  ]}
>
  <Text
    style={[
      styles.sectionTitle,
      { color: colors.text }
    ]}
  >
    Purchase & Warranty
  </Text>

  <DetailRow
    label="Purchased Date"
    value={asset.purchased_date}
    labelColor={colors.subText}
    valueColor={colors.text}
    borderColor={colors.border}
  />

  <DetailRow
    label="Warranty"
    value={`${asset.warranty_period} Months`}
    labelColor={colors.subText}
    valueColor={colors.text}
    borderColor={colors.border}
  />
</View>

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
          style={[
            styles.reportButton,
            isReportDisabled && {
              backgroundColor: "#9CA3AF",
            },
          ]}
          disabled={isReportDisabled}
          onPress={() =>
            router.push({
              pathname: "/(main)/reportIssue",
              params: { id: asset.id },
            })
          }
        >
          <Ionicons name="warning-outline" size={20} color="white" />
          <Text style={styles.reportButtonText}>
            {isReportDisabled
              ? "Issue Already Reported"
              : "Report an Issue"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
   </KeyboardAvoidingView>
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
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  detailImage: { width: 220,height:220,},
  mainTitle: { fontSize: 24, fontWeight: "bold", color: "#1E1E1E" },
  subTitle: { color: "#888", marginBottom: 15 },
  badgeRow: { flexDirection: "row", gap: 8, paddingBottom: 12 },
  badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  activeBadge: { backgroundColor: "#0070EB" },
  activeBadgeText: { color: "white", fontWeight: "bold", fontSize: 12 },
  conditionBadge: { backgroundColor: "#F3F4F6" },
  conditionBadgeText: { color: "#666", fontSize: 12 },
  // infoGrid: { flexDirection: "row", gap: 12, marginBottom: 12 },
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
sectionCard: {
  borderRadius: 20,
  padding: 18,
  marginBottom: 16,
},

detailRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  paddingVertical: 12,
  borderBottomWidth: 1,
  borderBottomColor: "#F1F5F9",
},

detailLabel: {
  color: "#64748B",
  fontSize: 14,
},

detailValue: {
  fontWeight: "600",
  fontSize: 14,
},

quickStats: {
  flexDirection: "row",
  flexWrap: "wrap",
  gap: 12,
  marginBottom: 16,
},

statCard: {
  width: "48%",
  paddingVertical: 18,
  paddingHorizontal: 10,
  borderRadius: 18,
  alignItems: "center",
},
statValue: {
  fontSize: 16,
  fontWeight: "700",
  marginTop: 8,
},

statLabel: {
  fontSize: 12,
  marginTop: 6,
},
assetCode: {
  fontSize: 16,
  fontWeight: "700",
  marginTop: 4,
},

serialText: {
  fontSize: 13,
  marginTop: 4,
  marginBottom: 14,
},

});