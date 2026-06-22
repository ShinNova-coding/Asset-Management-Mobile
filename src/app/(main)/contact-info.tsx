import HeaderBar from "@/src/components/HeaderBar";
import { useAuth } from "@/src/context/AuthContext";
import { useTheme } from "@/src/context/ThemeContext";
import { syncProfile } from "@/src/services/syncProfile";
import useIsOnline from "@/src/utils/useIsOnline";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ContactInfoSkeleton from "../../components/skeletons/ContactInfoSkeleton";
import { getProfile, saveProfile } from "../../database/profile.service";

export default function ContactInfoScreen() {
  const router = useRouter();
  const {token } = useAuth();
  const [loading, setLoading] = useState(true);
  const { colors, isDark } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const isOnline = useIsOnline();

   const onRefresh = async () => {
    try {
      setRefreshing(true);
        
        if ( isOnline && token) {
          await syncProfile(token);
          const updatedProfile = await getProfile();
          setProfile(updatedProfile);
        }
  
    } catch (error) {
      console.log("REFRESH ERROR:", error);
    } finally {
      setRefreshing(false);
    }
  }
  
    useEffect(() => {
      async function loadProfile() {

        if (!token) return;

        try{
            // await syncProfile(token);
            const localProfile = await getProfile();
            
            setProfile(localProfile);
            console.log ("LOCAL PROFILE INFO==>", localProfile)
            if (isOnline) {
              const serverProfile = await syncProfile(token);
              await saveProfile(serverProfile);
              setProfile(serverProfile);
            }
            // setPreviewImage(null);
        }catch (error) {
          console.error("Sync Error:", error);
        }finally {
          setLoading(false);
        }
      }
      loadProfile();
        
      }, [token]);

    if (loading) {
      return <ContactInfoSkeleton />;
    }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <HeaderBar title="Profile Info" backButtonAction={()=> router.push('/profile')}/>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/> }>
        <View style={styles.avatarSection}>
          <View style={styles.imageContainer}>
            <Image
              source={{
                uri:
                  profile?.local_image_path ?? profile?.preview_url ?? profile?.image_url,
              }}
              style={{
                width: 90,
                height: 90,
                borderRadius: 45,
              }}
            />
          </View>
          <Text style={[styles.userName, { color: colors.text }]}>{profile?.name}</Text>
          <Text style={[styles.userRole, { color: colors.subText }]}>{profile?.position || "Employee"}</Text>
          
          <View style={[styles.badgeRow, { marginTop: 10 }]}>
            <View style={styles.deptBadge}>
              <Text style={styles.deptText}>{profile?.roles?.[0]?.name || "No Role Assigned"}</Text>
            </View>
            <View style={styles.statusBadge}>
              <View style={styles.dot} />
              <Text style={styles.statusText}>{profile?.status}</Text>
            </View>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.background }]}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="business-outline" size={20} color="#0070EB" />
            <Text style={[styles.cardHeader, { color: colors.text }]}>Work Information</Text>
          </View>

          <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.label, { color: colors.subText }]}>Employee ID</Text>
            <Text style={[styles.value, { color: colors.text }]}>{profile?.employee_id}</Text>
          </View>
          <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.label, { color: colors.subText }]}>Role</Text>
            <Text style={[styles.value, { color: colors.text }]}>{profile?.roles?.[0]?.name || "N/A"}</Text>
          </View>
          <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.label, { color: colors.subText }]}>Position</Text>
            <Text style={[styles.value, { color: colors.text }]}>{profile?.position || "N/A"}</Text>
          </View>
          <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.label, { color: colors.subText }]}>Joined Date</Text>
            <Text style={[styles.value, { color: colors.text }]}>{profile?.joined_date || "N/A"}</Text>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.background }]}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="person-circle-outline" size={20} color="#0070EB" />
            <Text style={[styles.cardHeader, { color: colors.text }]}>Contact Details</Text>
          </View>

          <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.label, { color: colors.subText }]}>Corporate Email</Text>
            <Text style={[styles.value, { color: "#0070EB", fontWeight: "600" }]}>{profile?.email}</Text>
          </View>
          <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.label, { color: colors.subText }]}>Phone</Text>
            <Text style={[styles.value, { color: colors.text }]}>{profile?.phone_number}</Text>
          </View>
          <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
            <Text style={[styles.label, { color: colors.subText }]}>Office Location</Text>
            <Text style={[styles.value, { color: colors.text }]}>Dagon, Taw Win Center</Text>
          </View>
        </View>

        {/* <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.background }]}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="shield-checkmark-outline" size={20} color="#0070EB" />
            <Text style={[styles.cardHeader, { color: colors.text }]}>System Permissions</Text>
          </View>
          <Text style={styles.permissionSub}>ALLOWED</Text>

          {data?.permissions.map((permission, index) => (
            <View key={index} style={[styles.permissionRow, { backgroundColor: isDark ? "#334155" : "#E8EAF6"}]}>
              <Ionicons name="checkmark-circle" size={20} color="#10B981" />
              <Text style={[styles.permissionText, { color: colors.text }]}>{permission}</Text>
            </View>
          ))}
        </View> */}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#6366F1",
  },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  avatarSection: {
    alignItems: "center",
    marginVertical: 20,
  },
  imageContainer: { marginBottom: 12 },
  avatarCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",
  },
  userName: { fontSize: 22, fontWeight: "bold" },
  userRole: { fontSize: 14, marginTop: 4 },
  badgeRow: {
    flexDirection: "row",
    gap: 8,
  },
  deptBadge: {
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  deptText: { color: "#0070EB", fontSize: 11, fontWeight: "600" },
  statusBadge: {
    backgroundColor: "#E6F4EA",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#137333" },
  statusText: { color: "#137333", fontSize: 11, fontWeight: "600" },
  card: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  cardHeader: { fontSize: 15, fontWeight: "700" },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    // borderBottomColor: "#F3F4F6",
  },
  label: { fontSize: 13 },
  value: { fontSize: 14, fontWeight: "500" },
  alignRight: { flex: 1, textAlign: "right", marginLeft: 20 },
  // permissionSub: {
  //   fontSize: 11,
  //   color: "#9CA3AF",
  //   fontWeight: "bold",
  //   marginVertical: 10,
  //   letterSpacing: 0.5,
  // },
  // permissionRow: {
  //   flexDirection: "row",
  //   alignItems: "center",
  //   backgroundColor: "#F5F3FF",
  //   padding: 12,
  //   borderRadius: 12,
  //   gap: 10,
  //   marginBottom: 8,
  // },
  // permissionText: { fontSize: 13, fontWeight: "500" },
});