import HeaderBar from "@/src/components/HeaderBar";
import { useTheme } from "@/src/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { api } from "../../api/client";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSendLink = async () => {

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      Alert.alert("Validation Error", "Please enter your corporate email address.");
      return;
    }
    if (!emailRegex.test(email.trim())) {
      Alert.alert("Validation Error", "Please enter a valid corporate email address.");
      return;
    }

    try {
      setIsSending(true);

      const response = await api.post("/forgot-password", {
        email: email.trim().toLowerCase(),
      });
       console.log("FORGOT===>",response.data);
      // const data = response.data;

      // if (data.success) {
      router.push({
        pathname: "/reset-password",
        params: {
          email: email.trim().toLowerCase()
        }
      }
      )
        // console.log("Sending recovery link to:", email);

      // } else {
      //   Alert.alert("Account Not Found", data.message || "This email address is not registered in our database.");
      // }

    } catch (error: any) {

          console.log( "STATUS:",  error.response?.status);

          console.log("DATA:", error.response?.data);

          if (error.response) {
          const message = error.response.data?.message || "Something went wrong.";
            Alert.alert("This email address is not recognized.", message);
            setEmail("")
          } 
          else {
            Alert.alert(
              "Network Error",
              "Unable to connect to the verification server. Please try again later."
            );
          }
    } finally {
      setIsSending(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <HeaderBar 
        title="IT Asset Management" 
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
          <View style={styles.illustrationContainer}>
            <View style={styles.vectorWrapper}> 
              <View style={styles.shieldOutline}>
                <Ionicons name="shield-checkmark-outline" size={100} color="#6366F1" style={styles.shieldIcon} />
                <View style={styles.lockBadge}>
                  <Ionicons name="lock-closed" size={24} color="#6366F1" />
                </View>
              </View>
            </View>
          </View>

          <View style={styles.formContainer}>
            <Text style={[styles.title, { color: colors.text }]}>Forgot Password?</Text>
            <Text style={[styles.subtitle, { color: colors.subText }]}>
              Enter your corporate email address and we'll send you a secure link to reset your password.
            </Text>

            <Text style={styles.inputLabel}>Corporate Email</Text>
            <View style={[styles.inputWrapper, {backgroundColor: colors.background, borderColor: colors.border || "#E5E7EB" }]}>
              <Ionicons name="mail-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: colors.text}]}
                placeholder="name@gmail.com"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={setEmail}
                editable ={!isSending}
              />
            </View>

            <TouchableOpacity 
              style={[styles.primaryButton, { backgroundColor: colors.primary || "#4F46E5", opacity: isSending ? 0.7 : 1 }]}
              onPress={handleSendLink}
              activeOpacity={0.8}
              disabled={isSending}
            >
              {isSending ? (
                <ActivityIndicator color="#FFFFFF"/>
              ) : (
                <Text style={styles.primaryButtonText}>Send Reset Link</Text>
              )}              
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={() => router.push("/login")}
              disabled = {isSending}
            >
              <Text style={[styles.secondaryButtonText, { color: colors.primary || "#4F46E5" }]}>
                Back to Login
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>
              FOR SECURITY REASONS, RESET LINKS EXPIRE AFTER 15 MINUTES.
            </Text>
          </View>

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
    paddingHorizontal: 24,
    paddingBottom: 40,
    flexGrow: 1,
    justifyContent: "space-between",
  },
  illustrationContainer: {
    backgroundColor: "#F5F6FF",
    borderRadius: 28,
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    height: 280,
  },
  vectorWrapper: {
    width: "100%",
    height: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  shieldOutline: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  shieldIcon: {
    opacity: 0.85,
  },
  lockBadge: {
    position: "absolute",
    alignSelf: "center",
    top: "40%",
  },
  formContainer: {
    alignItems: "center",
    marginTop: 28,
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 22,
    marginTop: 10,
    paddingHorizontal: 10,
    fontWeight: "500",
  },
  inputLabel: {
    alignSelf: "flex-start",
    fontSize: 12,
    fontWeight: "700",
    color: "#6B7280",
    marginTop: 28,
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    width: "100%",
    height: 52,
    paddingHorizontal: 14,
    backgroundColor: "#FFFFFF",
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    height: "100%",
  },
  primaryButton: {
    width: "100%",
    height: 52,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
    elevation: 2,
    shadowColor: "#4F46E5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryButton: {
    marginTop: 20,
    paddingVertical: 10,
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: "600",
  },
  footerContainer: {
    marginTop: 35,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  footerText: {
    fontSize: 11,
    color: "#9CA3AF",
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: 0.5,
    lineHeight: 16,
  },
});