import { useTheme } from "@/src/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { api } from "../../../api/client";
import { useAuth } from "../../../context/AuthContext";
import { getProfile } from "../../../database/profile.service";
import { syncProfile } from "../../../services/syncProfile";

export async function uploadProfileImage ( imageUri: string) {
   const base64 = await FileSystem.readAsStringAsync(
    imageUri,
    {
      encoding: FileSystem.EncodingType.Base64,
    }
  );
  console.log("BASE64 LENGTH:", base64.length);
  const response = await api.post(
    "/profile/edit",
    {
      image: base64,
    }
  );
  return response.data;
}

export default function ProfileScreen() {
  
  const [uploading, setUploading ] = useState(false);
  const { logout, user, refreshUser, token } = useAuth();
  const { isDark, colors, setScheme } = useTheme();
  const [profile, setProfile] = useState<any>(null);
  const [previewImage, setPreviewImage ] = useState<string | null> (null);
  const [imageVersion, setImageVersion] = useState(Date.now());
  const imageUri =
    previewImage ??
    (profile?.preview_url ? `${profile.preview_url}?t=${imageVersion}`
      : profile?.image_url ? `${profile.image_url}?t=${imageVersion}`
      : "https://via.placeholder.com/150");

  
  const pickImage = async () => {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()
    
  if (!permission.granted) {
    alert("Permission is required to access gallery");
    return;
  }

  const result =await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if( result.canceled) return;

      setUploading(true);   
      const uri = result.assets[0].uri;

      try {
      await uploadProfileImage(uri);
      if (!token) return;

      await syncProfile(token);

      const updatedProfile = await getProfile();
      setProfile(updatedProfile);

      setImageVersion(Date.now());

      await refreshUser();
      setPreviewImage(null);

      Alert.alert ("Success", "Profile photo updated.");
    }catch (error: any) {
      console.log("FULL ERROR :",error);
      Alert.alert ("Error",JSON.stringify(error.response?.data));
    }finally {
      setUploading (false);
    }
};

const handleLogout = () => {

  Alert.alert(
    "Logout",
    "Are you sure you want to logout?",
    [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {

          try {

            await logout();

          } catch (error) {

            console.log(error);

          }
        },
      },
    ]
  );
};

useEffect(() => {

  async function loadProfile() {

    if (!token) return;

    await syncProfile(token);
    const localProfile = await getProfile();

    console.log("LOCAL PROFILE:", localProfile);

    setProfile(localProfile);
    setPreviewImage(null);
  }

  loadProfile();

}, [token]);

  return (
    
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
       
        <View style={[styles.profileCard, { backgroundColor: colors.card }]}>
          <View style={styles.imageContainer}>
              <Image
                key={imageVersion} 
                source={{ uri: imageUri }}
                style={styles.profileImage}
              />

              <TouchableOpacity
                disabled ={uploading}
                style={[
                  styles.editButton,
                  { backgroundColor: colors.primary },
                ]}
                onPress={pickImage}
                activeOpacity={0.8}
              >{uploading ? ( <ActivityIndicator color="white" />) : (
                <Ionicons
                  name= "pencil"
                  size={16}
                  color="white"
                />
              )}

              </TouchableOpacity>
            </View>

          <Text style={[styles.userName, { color: colors.text }]}>{profile?.name}</Text>
          
          <View style={[styles.deptBadge, { backgroundColor: isDark ? '#2D3748' : '#EEF2FF' }]}>
            <Ionicons name="business" size={14} color={colors.primary} />
            <Text style={[styles.deptText, { color: colors.primary }]}>{profile?.position || "Employee"}</Text>
          </View>

          <View style={styles.statsRow}>
            <View style={[styles.statBox, { backgroundColor: isDark ? '#334155' : '#F9FAFB' }]}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>12</Text>
              <Text style={[styles.statLabel, { color: colors.subText }]}>Assigned Assets</Text>
            </View>
            <View style={[styles.statBox, { backgroundColor: isDark ? '#334155' : '#F9FAFB' }]}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>99.8%</Text>
              <Text style={[styles.statLabel, { color: colors.subText }]}>Compliance</Text>
            </View>
          </View>
        </View>

        <Text style={[styles.sectionHeader, { color: colors.subText }]}>SYSTEM PREFERENCES</Text>

        <View style={[styles.menuCard, { backgroundColor: colors.card }]}>
          <TouchableOpacity style={styles.menuItem} onPress={()=>router.push({pathname:"/(main)/contact-info", params: { employeeId: "EMP-2026"}})}>
            <View style={[styles.iconBox, { backgroundColor: isDark ? '#2D3748' : '#EEF2FF' }]}>
              <Ionicons name="call-outline" size={22} color={colors.primary} />
            </View>
            <View style={styles.menuTextContent}>
              <Text style={[styles.menuTitle, { color: colors.text }]}>Contact Info</Text>
              <Text style={[styles.menuSubTitle, { color: colors.subText }]}>Manage corporate details</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.subText} />
          </TouchableOpacity>

          <View style={[styles.separator, { backgroundColor: colors.border }]} />

          <View style={styles.menuItem}>
            <View style={[styles.iconBox, { backgroundColor: isDark ? '#312E81' : '#F5F3FF' }]}>
              <Ionicons name="moon-outline" size={22} color={colors.primary} />
            </View>
            <View style={styles.menuTextContent}>
              <Text style={[styles.menuTitle, { color: colors.text }]}>Dark Mode</Text>
            </View>
         
            <Switch
              value={isDark}
              onValueChange={(value) => setScheme(value ? 'dark' : 'light')}
              trackColor={{ false: "#D1D5DB", true: colors.primary }}
              thumbColor={isDark ? "#FFFFFF" : "#F4F3F4"}
            />
          </View>

          <View style={[styles.separator, { backgroundColor: colors.border }]} />

          <TouchableOpacity onPress={()=> router.push("/security")} style={styles.menuItem}>
            <View style={[styles.iconBox, { backgroundColor: isDark ? '#2D3748' : '#EEF2FF' }]}>
              <Ionicons name="shield-checkmark-outline" size={22} color="#DB2777" />
            </View>
            <View style={styles.menuTextContent}>
              <Text style={[styles.menuTitle, { color: colors.text }]}>Security</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.subText} />
          </TouchableOpacity>

          <View style={[styles.separator, { backgroundColor: colors.border }]} />

          <TouchableOpacity onPress={()=> router.push("/about")} style={styles.menuItem}>
            <View style={[styles.iconBox, { backgroundColor: isDark ? '#2D3748' : '#EEF2FF' }]}>
              <Ionicons name="information-circle-outline" size={22} color={colors.primary} />
            </View>
            <View style={styles.menuTextContent}>
              <Text style={[styles.menuTitle, { color: colors.text }]}>About</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.subText} />
          </TouchableOpacity>
          </View>

        <TouchableOpacity onPress={handleLogout}
             style={[styles.logoutButton, { backgroundColor: isDark ? '#451212' : '#FFF1F2', borderColor: isDark ? '#7F1D1D' : '#FFE4E6' }]}
             >
              <Ionicons name="log-out-outline" size={22} color="#EF4444" />
              <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 , marginTop: -35},
  scrollContent: { padding: 20 },
  profileCard: {
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    marginBottom: 25,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  imageContainer: { position: "relative", marginBottom: 15 },
  profileImage: { width: 100, height: 100, borderRadius: 50 },
  verifiedBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#4F46E5",
    borderRadius: 12,
    padding: 2,
    borderWidth: 3,
    borderColor: "white",
  },
  userName: { fontSize: 22, fontWeight: "bold" },
  userRole: { fontSize: 14, marginTop: 4 },
  deptBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 12,
    gap: 6,
  },
  deptText: { fontWeight: "600", fontSize: 12 },
  statsRow: { flexDirection: "row", marginTop: 25, gap: 15 },
  statBox: {
    flex: 1,
    padding: 15,
    borderRadius: 16,
    alignItems: "center",
  },
  statNumber: { fontSize: 18, fontWeight: "bold" },
  statLabel: { fontSize: 11, marginTop: 4 },
  sectionHeader: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 10,
    marginLeft: 5,
    letterSpacing: 0.5,
  },
  menuCard: {
    borderRadius: 20,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  menuTextContent: { flex: 1, marginLeft: 15 },
  menuTitle: { fontSize: 16, fontWeight: "600" },
  menuSubTitle: { fontSize: 12, marginTop: 2 },
  separator: { height: 1, width: "100%" },
  logoutButton: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    marginBottom: 30,
  },
  logoutText: { color: "#EF4444", fontWeight: "bold", fontSize: 16 },
  editButton: {
  position: "absolute",
  bottom: 0,
  right: 0,
  width: 32,
  height: 32,
  borderRadius: 16,
  justifyContent: "center",
  alignItems: "center",
  borderWidth: 3,
  borderColor: "white",
  elevation: 4,
},
});