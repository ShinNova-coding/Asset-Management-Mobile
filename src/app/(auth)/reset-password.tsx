import { api } from "@/src/api/client";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ResetPasswordScreen() {
  const router = useRouter();

  const { email } = useLocalSearchParams<{email: string; }>();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(()=>{
    console.log("EMAIL:", email);
  },[email]);
  

  const handleResetPassword = async () => {
    try {
      if (!password || !confirmPassword) {
        Alert.alert("Error", "Please fill all fields");
        return;
      }

      if (password !== confirmPassword) {
        Alert.alert("Error", "Passwords do not match");
        return;
      }

      setLoading(true);

      const response = await api.post("/reset-password", {email, password, password_confirmation: confirmPassword, });

      const result = response.data;

      if (result.success) {
        Alert.alert(
          "Success",
          "Password reset successfully",
          [
            {
              text: "OK",
              onPress: () => router.replace("/(auth)/login"),
            },
          ]
        );
      } else {
        Alert.alert("Error", result.message);
      }
    } catch (error: any) {
      console.log(error);
      console.log({
  email,
  password,
  password_confirmation: confirmPassword,
});
      Alert.alert("Error", "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>

      <Text style={styles.email}>
        {email}
      </Text>

      <View style={styles.inputContainer}>
      <TextInput
        placeholder="New Password"
        secureTextEntry ={! showPassword}
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />
      <TouchableOpacity
      onPress={() => setShowPassword(!showPassword)}
      style={styles.eyeButton}
      >
      <Ionicons
        name={showPassword ? "eye-off-outline" : "eye-outline"}
        size={22}
        color="#666"
      />
      </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
      <TextInput
        placeholder="Confirm Password"
        secureTextEntry = {!showConfirmPassword}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        style={styles.input}
      />
      <TouchableOpacity
        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
        style={styles.eyeButton}
      >
        <Ionicons
          name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
          size={22}
          color="#666"
        />
      </TouchableOpacity>
    </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleResetPassword}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>
            Reset Password
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  email: {
    textAlign: "center",
    marginBottom: 20,
    color: "#666",
  },
  // input: {
  //   borderWidth: 1,
  //   borderColor: "#ddd",
  //   borderRadius: 10,
  //   padding: 15,
  //   marginBottom: 15,
  // },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
   inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
  },
    input: {
    flex: 1,
    paddingVertical: 15,
  },
  eyeButton: {
    paddingLeft: 10,
  },

});