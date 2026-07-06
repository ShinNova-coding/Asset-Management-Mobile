import { useTheme } from "@/src/context/ThemeContext";
import { getAssignedAssets } from "@/src/services/asset.service";
import useIsOnline from "@/src/utils/useIsOnline";
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { api } from "../../../api/client";
import SkeletonBox from "../../../components/skeletonBox";
import { useAuth } from "../../../context/AuthContext";
import { getProfile, updateProfileImage } from "../../../database/profile.service";
import { syncProfile } from "../../../services/syncProfile";
import ImageViewing from "react-native-image-viewing";


type Asset = {
  id: string;
  asset_code: string;
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

export async function uploadProfileImage ( imageUri: string) {
  const base64 = await FileSystem.readAsStringAsync(imageUri, {encoding: FileSystem.EncodingType.Base64,} );
  const response = await api.post(
    "/profile/edit",
    {
      image: base64,
    }
  );
  return response.data.data;
}

function ProfileHeaderSkeleton() {
  const { colors } = useTheme();
  return (
    <View style={[styles.profileCard, { backgroundColor: colors.card }]}>
      <View style={styles.imageContainer}>
        <SkeletonBox width={100} height={100} radius={50} />
      </View>
      <SkeletonBox width={140} height={22} radius={6} />
      <View style={{ marginTop: 12 }}>
        <SkeletonBox width={100} height={26} radius={12} />
      </View>
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <SkeletonBox width={40} height={20} radius={6} />
          <View style={{ marginTop: 6 }}><SkeletonBox width={70} height={11} radius={4} /></View>
        </View>
        <View style={styles.statBox}>
          <SkeletonBox width={40} height={20} radius={6} />
          <View style={{ marginTop: 6 }}><SkeletonBox width={70} height={11} radius={4} /></View>
        </View>
      </View>
    </View>
  );
}

export default function ProfileScreen() {
  const [uploading, setUploading ] = useState(false);
  const [imageLoading, setImageLoading] = useState(false); 
  const { logout, user, token } = useAuth();
  const { isDark, colors, setScheme } = useTheme();
  const [profile, setProfile] = useState<any>(null);
  const [previewImage, setPreviewImage ] = useState<string | null> (null);
  const [imageVersion, setImageVersion] = useState(Date.now());
  const [assets, setAssets] = useState<Asset[]>([]);
  const [assetsLoading, setAssetsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [viewerVisible, setViewerVisible] = useState(false);
  const insets = useSafeAreaInsets();
  const isOnline = useIsOnline();
  
  const conditionScoreMap: Record<string, number> = {
    new: 100,
    good: 85,
    fair: 60,
    bad: 20,
  };

 const onRefresh = async () => {
  try {
    setRefreshing(true);
    setAssetsLoading(true);
      
      if ( isOnline && token) {
        await syncProfile(token);
        const updatedProfile = await getProfile();
        setProfile(updatedProfile);
        setImageVersion(Date.now());
      }

      const data = await getAssignedAssets();
      setAssets(data || []);

  } catch (error) {
    console.log("REFRESH ERROR:", error);
  } finally {
    setRefreshing(false);
    setAssetsLoading(false);
  }
};

  const healthScore = assets.length === 0
      ? "- "
      : Math.round(
          assets.reduce((sum, a) => {
            const condition = (a.condition || "").toLowerCase();
            return sum + (conditionScoreMap[condition] ?? 50);
          }, 0) / assets.length
        );

  const imageUri = previewImage ??
    (profile?.local_image_path ? `${profile.local_image_path}?t=${imageVersion}`
      : profile?.image_url ? `${profile.image_url}?t=${imageVersion}`
      : undefined); 



  const pickImage = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
          
        if (!permission.granted) {
          alert("Permission is required to access gallery");
          return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images"],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });

        if (result.canceled) return;

        setUploading(true);   

        try {
          const uri = result.assets[0].uri;

            // immediately show selected image
          if (profile) {
            setProfile({
              ...profile,
              local_image_path: uri,
            });
          }
          
          const updatedImage = await uploadProfileImage(uri);

          const filename = `profile_${profile.id}.jpg`;

          const localImagePath = FileSystem.documentDirectory + filename;


          await FileSystem.downloadAsync( updatedImage.preview_url, localImagePath);

          await updateProfileImage( updatedImage.image_url, updatedImage.preview_url, localImagePath);

          const latestProfile = await getProfile();
          setProfile(latestProfile);
          setImageVersion(Date.now());

          Alert.alert ("Success", "Profile photo updated.");
        } catch (error) {
          console.log("UPLOAD ERROR :", error);
        } finally {
          setUploading (false);
        }
  };

  const handleLogout = () => {

            if (!isOnline) {
              Alert.alert(
                "No Internet Connection",
                "You must be online to logout."
              );
              return;
            }

    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
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


    async function loadProfile() {
      try{
      setAssetsLoading(true);
      
      const localProfile = await getProfile();

      if (localProfile){
      setProfile(localProfile);
      // console.log ("LOCAL PROFILE==>", localProfile)
      }
      if ( token) {
        await syncProfile(token);
        
        setProfile(await getProfile());
        setImageVersion(Date.now());
      }

    }catch (error){
      console.log("PROFILE LOAD ERROR:", error);
    }
    try {
      const data = await getAssignedAssets();
      setAssets(data || []);
    }catch (error){
      console.log("ASSET LOAD ERROR:", error);
    }
    finally {
      setAssetsLoading(false);
    }
    }

    useEffect(() => {
    loadProfile();
    }, []);


  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["top"]}>
      <ScrollView 
      showsVerticalScrollIndicator={false} 
      contentContainerStyle={styles.scrollContent} 
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/> }>

        {!profile ? (
          <ProfileHeaderSkeleton />
        ) : (
          <View style={[styles.profileCard, { backgroundColor: colors.card }]}>
            <View style={styles.imageContainer}>
              {imageUri ? (
                <View style={styles.imageWrapper}>
                  <TouchableOpacity
                    onPress={() => imageUri && setViewerVisible(true)}
                  >
                    <Image
                      key={imageVersion} 
                      source={{ uri: imageUri }}
                      style={styles.profileImage}
                    />
                  </TouchableOpacity>
                  {imageLoading && (
                    <View style={[styles.imageLoaderOverlay, { backgroundColor: colors.card }]}>
                      <ActivityIndicator size="small" color={colors.primary} />
                    </View>
                  )}
                </View>
              ) : (

                <View style={[styles.initialsPlaceholder, { backgroundColor: colors.primary }]}>
                  <Text style={styles.initialsText}>
                    {profile?.name?.charAt(0)?.toUpperCase() || "E"}
                  </Text>
                </View>
              )}

              <TouchableOpacity
                disabled={uploading}
                style={[
                  styles.editButton,
                  { backgroundColor: colors.primary, borderColor: colors.card },
                ]}
                onPress={pickImage}
                activeOpacity={0.8}
              >
                {uploading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Ionicons name="pencil" size={14} color="white" />
                )}
              </TouchableOpacity>
            </View>

            <Text style={[styles.userName, { color: colors.text }]}>{profile?.name}</Text>
            
            <View style={[styles.deptBadge, { backgroundColor: isDark ? '#2D3748' : '#EEF2FF' }]}>
              <Ionicons name="business" size={14} color={colors.primary} />
              <Text style={[styles.deptText, { color: colors.primary }]}>{profile?.position || "Employee"}</Text>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                {assetsLoading ? (
                  <SkeletonBox width={40} height={20} radius={6} />
                ) : (
                  <Text style={[styles.statNumber, {color: colors.text}]}>
                    {assets.filter(a => a.status === "assigned").length}
                  </Text>
                )}
                <Text style={[styles.statLabel, {color: colors.subText}]}>Active Assets</Text>
              </View>
              <View style={styles.statBox}>
                {assetsLoading ? (
                  <SkeletonBox width={50} height={20} radius={6} />
                ) : (
                  <Text style={[styles.statNumber, {color: colors.text}]}>{healthScore}%</Text>
                )}
                <Text style={[styles.statLabel, {color: colors.subText}]}>Asset Health</Text>
              </View>
            </View>
          </View>
        )}

        <Text style={[styles.sectionHeader, { color: colors.subText }]}>SYSTEM PREFERENCES</Text>

        <View style={[styles.menuCard, { backgroundColor: colors.card }]}>
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push({pathname:"/(main)/contact-info", params: { employeeId: "EMP-2026"}})}>
            <View style={[styles.iconBox, { backgroundColor: isDark ? '#2D3748' : '#EEF2FF' }]}>
              <Ionicons name="call-outline" size={22} color={colors.primary} />
            </View>
            <View style={styles.menuTextContent}>
              <Text style={[styles.menuTitle, { color: colors.text }]}>Profile Info</Text>
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

          <TouchableOpacity onPress={() => router.push("/security")} style={styles.menuItem}>
            <View style={[styles.iconBox, { backgroundColor: isDark ? '#2D3748' : '#EEF2FF' }]}>
              <Ionicons name="shield-checkmark-outline" size={22} color="#DB2777" />
            </View>
            <View style={styles.menuTextContent}>
              <Text style={[styles.menuTitle, { color: colors.text }]}>Security</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.subText} />
          </TouchableOpacity>

          <View style={[styles.separator, { backgroundColor: colors.border }]} />

          <TouchableOpacity onPress={() => router.push("/about")} style={styles.menuItem}>
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
<Modal
  visible={viewerVisible}
  transparent
  animationType="fade"
  onRequestClose={() => setViewerVisible(false)}
>
  <View style={styles.modalContainer}>
    <TouchableOpacity
      style={styles.closeButton}
      onPress={() => setViewerVisible(false)}
    >
      <Ionicons name="close" size={32} color="white" />
    </TouchableOpacity>

    <Image
      source={{ uri: imageUri }}
      style={styles.fullImage}
      resizeMode="contain"
    />
  </View>
</Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, marginTop: -35 },
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
  imageWrapper: { width: 100, height: 100, borderRadius: 50, overflow: "hidden", position: "relative" },
  profileImage: { width: 100, height: 100, borderRadius: 50 },
  imageLoaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  initialsPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  initialsText: {
    color: "white",
    fontSize: 36,
    fontWeight: "bold",
  },
  userName: { fontSize: 22, fontWeight: "bold" },
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
    elevation: 4,
  },
  modalContainer: {
  flex: 1,
  backgroundColor: "black",
  justifyContent: "center",
  alignItems: "center",
},

closeButton: {
  position: "absolute",
  top: 50, // or use insets.top + 16
  right: 20,
  zIndex: 10,
},

fullImage: {
  width: "100%",
  height: "100%",
},
});