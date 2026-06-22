import HeaderBar from "@/src/components/HeaderBar";
import { useTheme } from "@/src/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { api } from "../../api/client";

export default function SecurityScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const handleUpdatePassword = async () => {
  try {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in all security fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    const response = await api.post("/change-password", {
      current_password: currentPassword,
      new_password: newPassword,
      new_password_confirmation: confirmPassword,
    });

    const result = response.data;

    if (result.success) {
      Alert.alert("Success", "Password updated successfully!", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } else {
      Alert.alert("Error", result.message || "Failed to update password");
    }
  } catch (error: any) {
  console.log(
    "CHANGE PASSWORD ERROR:",
    error?.response?.data || error
  );

  const message =
    error?.response?.data?.message ||
    "Something went wrong";

  if (
    message.toLowerCase().includes("current password")
  ) {
    setPasswordError(message);
  } else {
    Alert.alert("Error", message);
  }
} finally {
    setLoading(false);
  }
};

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <HeaderBar 
        title="Security Settings" 
        backButtonAction={() => router.back()} 
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.topExplanation}>
            <View style={[styles.shieldIconCard, { backgroundColor: isDark ? "#1E293B" : "#F5F3FF" }]}>
              <Ionicons name="lock-closed" size={32} color="#0070EB" />
            </View>
            <Text style={[styles.mainTitle, { color: colors.text }]}>Change Password</Text>
            <Text style={[styles.subtitle, { color: colors.subText }]}>
              Choose a strong, secure corporate password containing mixed characters to protect your account clearance.
            </Text>
          </View>

          <View style={[styles.formCard, { backgroundColor: colors.card }]}>

            <Text style={[styles.inputLabel, { color: colors.subText }]}>CURRENT PASSWORD</Text>
            {/* <View style={[styles.inputContainer, { borderColor: colors.border || "#DDD" }]}> */}
            <View style={[styles.inputContainer, { backgroundColor: colors.background, borderColor: passwordError
        ? "#DC2626"
        : "#D1D5DB", }]}>
              <Ionicons name="key-outline" size={20} color="#999" />
              <TextInput
                secureTextEntry={!showCurrent}
                placeholder="••••••••"
                placeholderTextColor="#999"
                style={[styles.input, { color: colors.text }]}
                value={currentPassword}
                onChangeText={(text) => {
                  setCurrentPassword(text);
                  setPasswordError("");
                }}
              />
              <TouchableOpacity onPress={() => setShowCurrent(!showCurrent)}>
                <Ionicons name={showCurrent ? "eye-off-outline" : "eye-outline"} size={20} color="#999" />
              </TouchableOpacity>
            </View>
            {passwordError ? (
                  <Text style={styles.errorText}>
                    {passwordError}
                  </Text>
                ) : null}

            <Text style={[styles.inputLabel, { color: colors.subText }, styles.spaceTop]}>NEW PASSWORD</Text>
            <View style={[styles.inputContainer, { backgroundColor: colors.background }]}>
              <Ionicons name="lock-open-outline" size={20} color="#999" />
              <TextInput
                secureTextEntry={!showNew}
                placeholder="••••••••"
                placeholderTextColor="#999"
                style={[styles.input, { color: colors.text }]}
                value={newPassword}
                onChangeText={setNewPassword}
              />
              <TouchableOpacity onPress={() => setShowNew(!showNew)}>
                <Ionicons name={showNew ? "eye-off-outline" : "eye-outline"} size={20} color="#999" />
              </TouchableOpacity>
            </View>

            {/* CONFIRM NEW PASSWORD */}
            <Text style={[styles.inputLabel, { color: colors.subText }, styles.spaceTop]}>CONFIRM NEW PASSWORD</Text>
            <View style={[styles.inputContainer, { backgroundColor: colors.background}]}>
              <Ionicons name="checkmark-circle-outline" size={20} color="#999" />
              <TextInput
                secureTextEntry={!showConfirm}
                placeholder="••••••••"
                placeholderTextColor="#999"
                style={[styles.input, { color: colors.text }]}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                <Ionicons name={showConfirm ? "eye-off-outline" : "eye-outline"} size={20} color="#999" />
              </TouchableOpacity>
            </View>

          </View>

          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: loading ? "#999" : colors.primary || "#0070EB" }
            ]}
            onPress={handleUpdatePassword}
            activeOpacity={0.8}
            disabled={loading}
          >
            <Text style={styles.actionButtonText}>Update Password</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  topExplanation: {
    alignItems: "center",
    marginVertical: 15,
  },
  shieldIconCard: {
    width: 70,
    height: 70,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    fontSize: 13,
    lineHeight: 20,
    marginTop: 6,
    paddingHorizontal: 15,
  },
  formCard: {
    borderRadius: 20,
    padding: 20,
    marginTop: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  spaceTop: {
    marginTop: 18,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 52,
    backgroundColor: "#F9F9FB",
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    height: "100%",
  },
  actionButton: {
    height: 54,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  actionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  errorText: {
  color: "#DC2626",
  fontSize: 12,
  marginTop: 6,
  marginLeft: 4,
},
});