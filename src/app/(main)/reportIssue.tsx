import HeaderBar from "@/src/components/HeaderBar";
import { useTheme } from "@/src/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const issueTypes = [
  {
    id: "Damage",
    icon: "build-outline",
  },
  {
    id: "Software",
    icon: "terminal-outline",
  },
  {
    id: "Theft",
    icon: "reload-outline",
  },
  {
    id: "Other",
    icon: "help-circle-outline",
  },
];

const assetsData = [
  {
    id: 1,
    name: "MacBook Pro M3",
    serial: "IT-8842",
  },
  {
    id: 2,
    name: "iPhone 15 Pro",
    serial: "IT-1109",
  },
  {
    id: 3,
    name: "iPad Air",
    serial: "IT-9901",
  },
    {
    id: 7,
    name: "iPhone 15 Pro",
    serial: "IT-1109",
  },
  {
    id: 8,
    name: "iPad Air",
    serial: "IT-9901",
  },
];

export default function ReportIssueScreen() {
  const { colors, isDark } = useTheme();
  const router = useRouter();

  const { id } = useLocalSearchParams();

  const asset = assetsData.find(
    (a) => a.id === Number(id)
  );

  const [selectedIssue, setSelectedIssue] = useState("Damage");

  const [description, setDescription] = useState("");

  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) return;

    const result =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes:['images'],
        quality: 1,
      });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      <HeaderBar
        title="Report an Issue"
        backButtonAction={() => router.back()}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View
          style={[
            styles.alertCard,
            {
              backgroundColor: isDark
                ? "#3B1F1F"
                : "#FEE2E2",
            },
          ]}
        >
          <Ionicons
            name="alert-circle"
            size={22}
            color="#DC2626"
          />

          <View style={{ flex: 1 }}>
            <Text style={styles.alertTitle}>
              Urgent Report
            </Text>

            <Text style={styles.alertText}>
              This report will be immediately flagged
              for IT review. Please provide accurate
              details to ensure rapid resolution.
            </Text>
          </View>
        </View>

        <Text
          style={[
            styles.label,
            { color: colors.subText },
          ]}
        >
          TARGET ASSET
        </Text>

        <TouchableOpacity
          activeOpacity={0.8}
          style={[
            styles.dropdown,
            {
              backgroundColor: colors.card,
              borderColor: isDark
                ? "#334155"
                : "#E5E7EB",
            },
          ]}
        >
          <Text
            style={[
              styles.dropdownText,
              { color: colors.text },
            ]}
          >
            {asset?.name} ({asset?.serial})
          </Text>
        </TouchableOpacity>
        <Text
          style={[
            styles.label,
            { color: colors.subText },
          ]}
        >
          ISSUE TYPE
        </Text>

        <View style={styles.issueGrid}>
          {issueTypes.map((item) => {
            const active =
              selectedIssue === item.id;

            return (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.8}
                onPress={() =>
                  setSelectedIssue(item.id)
                }
                style={[
                  styles.issueCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: active
                      ? "#4F46E5"
                      : isDark
                      ? "#334155"
                      : "#E5E7EB",
                    borderWidth: active ? 2 : 1,
                  },
                ]}
              >
                <Ionicons
                  name={item.icon as any}
                  size={22}
                  color={
                    active
                      ? "#4F46E5"
                      : colors.subText
                  }
                />

                <Text
                  style={[
                    styles.issueText,
                    {
                      color: active
                        ? "#4F46E5"
                        : colors.text,
                    },
                  ]}
                >
                  {item.id}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text
          style={[
            styles.label,
            { color: colors.subText },
          ]}
        >
          DESCRIBE THE PROBLEM
        </Text>

        <TextInput
          multiline
          value={description}
          onChangeText={setDescription}
          placeholder="Please provide specific details about the issue..."
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

        <Text
          style={[
            styles.label,
            { color: colors.subText },
          ]}
        >
          SUPPORTING EVIDENCE
        </Text>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={pickImage}
          style={[
            styles.uploadBox,
            {
              backgroundColor: colors.card,
              borderColor: "#C4B5FD",
            },
          ]}
        >
          {image ? (
            <Image
              source={{ uri: image }}
              style={styles.previewImage}
            />
          ) : (
            <>
              <Ionicons
                name="camera-outline"
                size={34}
                color="#4F46E5"
              />

              <Text style={styles.uploadTitle}>
                Upload Photo
              </Text>

              <Text style={styles.uploadSubtitle}>
                Tap to capture or select images
              </Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.submitButton}
        >
          <Ionicons
            name="paper-plane-outline"
            size={18}
            color="white"
          />

          <Text style={styles.submitText}>
            Submit Report
          </Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          By submitting, you confirm the details
          are accurate for inventory compliance.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    padding: 16,
    paddingBottom: 40,
  },

  alertCard: {
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    gap: 12,
    marginBottom: 22,
  },

  alertTitle: {
    color: "#DC2626",
    fontWeight: "700",
    fontSize: 15,
    marginBottom: 4,
  },

  alertText: {
    color: "#DC2626",
    fontSize: 13,
    lineHeight: 18,
  },

  label: {
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 10,
    marginTop: 6,
  },

  dropdown: {
    height: 56,
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 22,
  },

  dropdownText: {
    fontSize: 15,
    fontWeight: "600",
  },

  issueGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 22,
  },

  issueCard: {
    width: "48%",
    height: 95,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },

  issueText: {
    marginTop: 8,
    fontWeight: "700",
    fontSize: 15,
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

  uploadBox: {
    height: 180,
    borderRadius: 18,
    borderWidth: 1.5,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    overflow: "hidden",
  },

  uploadTitle: {
    color: "#4F46E5",
    fontWeight: "700",
    fontSize: 16,
    marginTop: 10,
  },

  uploadSubtitle: {
    color: "#888",
    marginTop: 4,
    fontSize: 13,
  },

  previewImage: {
    width: "100%",
    height: "100%",
  },

  submitButton: {
    height: 58,
    backgroundColor: "#4F46E5",
    borderRadius: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },

  submitText: {
    color: "white",
    fontSize: 17,
    fontWeight: "700",
  },

  footerText: {
    textAlign: "center",
    color: "#888",
    fontSize: 12,
    marginTop: 14,
    lineHeight: 18,
    paddingHorizontal: 20,
  },
});