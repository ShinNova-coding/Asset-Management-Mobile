import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  
  const handleLogin = () => {
  router.replace("/(main)/(tabs)");
};

  return (
    <KeyboardAvoidingView style={styles.container} behavior= {Platform.OS === 'ios' ? 'padding' : 'height'}>

      <View style={styles.card}>

        <View style={styles.logoContainer}>
          <Ionicons name="cube-outline" size={40} color="white" />
        </View>

        <Text style={styles.title}>Welcome to ITAMS</Text>
        <Text style={styles.subtitle}>
          IT Asset Management System
        </Text>

        <View style={styles.form}>

          <Text style={styles.label}>EMAIL ADDRESS</Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="mail-outline"
              size={20}
              color="#999"
            />

            <TextInput
              placeholder="name@company.com"
              style={styles.input}
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              autoFocus
              autoCapitalize="none"
              // autoComplete="email"
            />
          </View>

          <View style={styles.passwordRow}>
            <Text style={styles.label}>PASSWORD</Text>

            <TouchableOpacity onPress={()=> router.push("/forgot-password")}>
              <Text style={styles.forgot}>
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="#999"
            />

            <TextInput
              placeholder="••••••••"
              secureTextEntry={!passwordVisible}
              style={styles.input}
              value={password}
              onChangeText={setPassword}
            />

            <TouchableOpacity
              onPress={() =>
                setPasswordVisible(!passwordVisible)
              }
            >
              <Ionicons
                name={
                  passwordVisible
                    ? "eye-off-outline"
                    : "eye-outline"
                }
                size={20}
                color="#999"
              />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>
              Login
            </Text>
          </TouchableOpacity>

        </View>
      </View>

      <View style={styles.bottomText}>
        <Text style={{ color: "#666" }}>
          Need field access?
        </Text>

        <TouchableOpacity>
          <Text style={styles.request}>
            {" "}Request Account
          </Text>
        </TouchableOpacity>
      </View>

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F2FA",
    justifyContent: "center",
    padding: 20,
  },

  card: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    elevation: 3,
  },

  logoContainer: {
    width: 80,
    height: 80,
    backgroundColor: "#0070EB",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#111",
  },

  subtitle: {
    textAlign: "center",
    color: "#666",
    marginTop: 8,
    marginBottom: 30,
  },

  form: {
    gap: 15,
  },

  label: {
    fontSize: 12,
    fontWeight: "700",
    color: "#666",
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 55,
    backgroundColor: "#F9F9FB",
  },

  input: {
    flex: 1,
    marginLeft: 10,
  },

  passwordRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  forgot: {
    color: "#0070EB",
    fontWeight: "600",
    fontSize: 12,
  },

  button: {
    backgroundColor: "#0070EB",
    height: 55,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },

  bottomText: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30,
  },

  request: {
    color: "#0070EB",
    fontWeight: "700",
  },
});