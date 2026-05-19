import HeaderBar from "@/src/components/HeaderBar";
import { useTheme } from "@/src/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
interface ContactData {
  employeeId: string;
  role: string;
  position: string;
  department: string;
  corporateEmail: string;
  phone: string;
  officeLocation: string;
  permissions: string[];
}

export default function ContactInfoScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  
  const { employeeId } = useLocalSearchParams<{ employeeId: string }>();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ContactData | null>(null);

  useEffect(() => {
    const fetchContactDetails = async () => {
      try {
        setLoading(true);
        // Replace this mockup block with your real axios/fetch call later:
        // const response = await axios.get(`https://api.yourbackend.com/employees/${employeeId}`);
        
        // Simulating API Latency
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Simulated Response matching the image details
        setData({
          employeeId: employeeId,
          role: "Employee",
          position: "IT Specialist",
          department: "Infrastructure & Security",
          corporateEmail: "alex@company.com",
          phone: "+95 912345678",
          officeLocation: "Yangon HQ",
          permissions: ["View Assigned Assets", "Submit Asset Requests"],
        });
      } catch (error) {
        console.error("Failed to load employee metadata:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContactDetails();
  }, [employeeId]);

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background, justifyContent: "center" }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <HeaderBar title="Contact Info" backButtonAction={()=> router.push('/profile')}/>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.avatarSection}>
          <View style={styles.imageContainer}>
            <View style={[styles.avatarCircle, { backgroundColor: '#EEF2FF' }]}>
              <Ionicons name="person-outline" size={40} color="#0070EB" />
            </View>
          </View>
          <Text style={[styles.userName, { color: colors.text }]}>Alex Rivers</Text>
          <Text style={[styles.userRole, { color: colors.subText }]}>{data?.position}</Text>
          
          <View style={[styles.badgeRow, { marginTop: 10 }]}>
            <View style={styles.deptBadge}>
              <Text style={styles.deptText}>{data?.department}</Text>
            </View>
            <View style={styles.statusBadge}>
              <View style={styles.dot} />
              <Text style={styles.statusText}>Active Employee</Text>
            </View>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.background }]}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="business-outline" size={20} color="#0070EB" />
            <Text style={[styles.cardHeader, { color: colors.text }]}>Work Information</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={[styles.label, { color: colors.subText }]}>Employee ID</Text>
            <Text style={[styles.value, { color: colors.text }]}>{data?.employeeId}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.label, { color: colors.subText }]}>Role</Text>
            <Text style={[styles.value, { color: colors.text }]}>{data?.role}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.label, { color: colors.subText }]}>Position</Text>
            <Text style={[styles.value, { color: colors.text }]}>{data?.position}</Text>
          </View>
          <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
            <Text style={[styles.label, { color: colors.subText }]}>Department</Text>
            <Text style={[styles.value, { color: colors.text }, styles.alignRight]} numberOfLines={1}>
              {data?.department}
            </Text>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.background }]}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="person-card-outline" size={20} color="#0070EB" />
            <Text style={[styles.cardHeader, { color: colors.text }]}>Contact Details</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={[styles.label, { color: colors.subText }]}>Corporate Email</Text>
            <Text style={[styles.value, { color: "#0070EB", fontWeight: "600" }]}>{data?.corporateEmail}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.label, { color: colors.subText }]}>Phone</Text>
            <Text style={[styles.value, { color: colors.text }]}>{data?.phone}</Text>
          </View>
          <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
            <Text style={[styles.label, { color: colors.subText }]}>Office Location</Text>
            <Text style={[styles.value, { color: colors.text }]}>{data?.officeLocation}</Text>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.background }]}>
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
        </View>

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
    borderBottomColor: "#F3F4F6",
  },
  label: { fontSize: 13 },
  value: { fontSize: 14, fontWeight: "500" },
  alignRight: { flex: 1, textAlign: "right", marginLeft: 20 },
  permissionSub: {
    fontSize: 11,
    color: "#9CA3AF",
    fontWeight: "bold",
    marginVertical: 10,
    letterSpacing: 0.5,
  },
  permissionRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F3FF",
    padding: 12,
    borderRadius: 12,
    gap: 10,
    marginBottom: 8,
  },
  permissionText: { fontSize: 13, fontWeight: "500" },
});