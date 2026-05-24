import HeaderBar from "@/src/components/HeaderBar";
import { useTheme } from "@/src/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { router } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AboutScreen() {
  const { colors, isDark } = useTheme();
  const appVersion = Constants.expoConfig?.version || "Unknown";

  const features = [
    {
      id: 1,
      icon: "cube-outline",
      title: "Asset Tracking",
    },
    {
      id: 2,
      icon: "briefcase-outline",
      title: "Employee Asset Assignment",
    },
    {
      id: 3,
      icon: "build-outline",
      title: "Maintenance Monitoring",
    },
    {
      id: 4,
      icon: "shield-checkmark-outline",
      title: "Warranty Tracking",
    },
    {
      id: 5,
      icon: "lock-closed-outline",
      title: "Secure Asset Management",
    },
  ];

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
        <HeaderBar title="About" backButtonAction={()=> router.push('/profile')}/>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.logoSection}>
          <View style={styles.logoContainer}>
            <Ionicons
              name="cube-outline"
              size={40}
              color="white"
            />
          </View>

          <Text
            style={[
              styles.appName,
              { color: colors.text },
            ]}
          >
            ITAMS
          </Text>

          <Text
            style={[
              styles.subtitle,
              { color: colors.subText },
            ]}
          >
            IT Asset Management System
          </Text>

          <View
            style={[
              styles.versionBadge,
              {
                backgroundColor: isDark
                  ? "#1E293B"
                  : "#EEF2FF",
              },
            ]}
          >
            <Text
              style={[
                styles.versionText,
                { color: colors.primary },
              ]}
            >
              {appVersion}
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.card,
            { backgroundColor: colors.card },
          ]}
        >
          <Text
            style={[
              styles.cardTitle,
              { color: colors.primary },
            ]}
          >
            About ITAMS
          </Text>

          <Text
            style={[
              styles.cardDescription,
              { color: colors.subText },
            ]}
          >
            ITAMS helps organizations efficiently manage,
            monitor, and track company IT assets including
            laptops, mobile devices, accessories, and
            infrastructure equipment.
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.9}
          style={[
            styles.vendorCard,
            { backgroundColor: colors.card },
          ]}
        >
          <View style={styles.vendorLeft}>
            <View style={styles.vendorIcon}>
              <Ionicons
                name="business-outline"
                size={20}
                color="white"
              />
            </View>

            <View>
              <Text
                style={[
                  styles.vendorLabel,
                  { color: colors.subText },
                ]}
              >
                VENDOR
              </Text>

              <Text
                style={[
                  styles.vendorName,
                  { color: colors.text },
                ]}
              >
                Powered by Agga.io
              </Text>
            </View>
          </View>

          <Ionicons
            name="open-outline"
            size={20}
            color={colors.subText}
          />
        </TouchableOpacity>

        {/* Features Card */}
        <View
          style={[
            styles.card,
            { backgroundColor: colors.card },
          ]}
        >
          <Text
            style={[
              styles.cardTitle,
              { color: colors.primary },
            ]}
          >
            Core Features
          </Text>

          {features.map((item) => (
            <View
              key={item.id}
              style={styles.featureRow}
            >
              <View
                style={[
                  styles.featureIcon,
                  {
                    backgroundColor: isDark
                      ? "#1E293B"
                      : "#EEF2FF",
                  },
                ]}
              >
                <Ionicons
                  name={item.icon as any}
                  size={18}
                  color={colors.primary}
                />
              </View>

              <Text
                style={[
                  styles.featureText,
                  { color: colors.text },
                ]}
              >
                {item.title}
              </Text>
            </View>
          ))}
        </View>

        <Text
          style={[
            styles.footerText,
            { color: colors.subText },
          ]}
        >
          © {new Date().getFullYear()} Agga.io. All rights reserved.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollContent: {
    padding: 18,
    paddingBottom: 40,
  },

  logoSection: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 24,
  },

  logoContainer: {
    width: 90,
    height: 90,
    backgroundColor: "#0070EB",
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,

    shadowColor: "#0070EB",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },

  appName: {
    fontSize: 30,
    fontWeight: "700",
  },

  subtitle: {
    marginTop: 6,
    fontSize: 14,
  },

  versionBadge: {
    marginTop: 14,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },

  versionText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.6,
  },

  card: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 14,
  },

  cardDescription: {
    fontSize: 15,
    lineHeight: 24,
  },

  vendorCard: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  vendorLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  vendorIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#0070EB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  vendorLabel: {
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 3,
    letterSpacing: 0.5,
  },

  vendorName: {
    fontSize: 17,
    fontWeight: "700",
  },

  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  featureText: {
    fontSize: 16,
    fontWeight: "500",
  },

  footerText: {
    textAlign: "center",
    marginTop: 10,
    fontSize: 13,
  },
});