import { useTheme } from "@/src/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const notifications = [
  {
    id: "1",
    type: "assigned",
    title: "New Asset Assigned",
    message: "A Dell Monitor has been assigned to you.",
    time: "2h ago",
    actionText: "View Asset",
    badge: "NEW",
  },
  {
    id: "2",
    type: "repair",
    title: "Repair Completed",
    message: "Your MacBook repair is finished. Please collect it.",
    time: "1d ago",
    actionText: "Pickup Instructions",
  },
  {
    id: "3",
    type: "urgent",
    title: "Return Reminder",
    message: "iPad return due in 3 days.",
    time: "3d left",
    actionText: "Request Extension",
    badge: "URGENT",
  },
];

export default function NotificationScreen() {
  const { colors, isDark } = useTheme();
  
  const renderIcon = (type: string) => {
    switch (type) {
      case "assigned":
        return (
          <View style={[styles.iconContainer, { backgroundColor: colors.primary }]}>
            <Ionicons
              name="document-text"
              size={20}
              color="#fff"
            />
          </View>
        );

      case "repair":
        return (
          <View style={[styles.iconContainer, { backgroundColor: colors.primary }]}>
            <Ionicons
              name="build"
              size={20}
              color="#fff"
            />
          </View>
        );

      case "urgent":
        return (
          <View style={[styles.iconContainer, { backgroundColor: "#FEE2E2" }]}>
            <Ionicons
              name="calendar"
              size={20}
              color="#DC2626"
            />
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={[styles.container,{ backgroundColor: colors.background}]}>

      <View style={styles.titleRow}>
        <Text style={[styles.title, {color: colors.text}]}>Notifications</Text>

        <TouchableOpacity>
          <Text style={styles.markAll}>
            Mark all as read
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.subtitle, {color: colors.subText}]}>
        Stay updated on your IT assets
      </Text>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingBottom: 120,
        }}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.9}
            style={[
              styles.card, { backgroundColor: colors.card, borderColor: colors.background},
              item.type === "urgent" && styles.urgentCard,
            ]}
          >
            {renderIcon(item.type)}

            <View style={styles.content}>
              <View style={styles.topRow}>
                <Text style={[styles.cardTitle, {color: colors.text}]}>
                  {item.title}
                </Text>

                <Text style={[styles.time, {color: colors.subText}]}>
                  {item.time}
                </Text>
              </View>

              <Text style={[styles.message, {color: colors.text}]}>
                {item.message}
              </Text>

              <View style={styles.bottomRow}>
                {item.badge && (
                  <View
                    style={[
                      styles.badge,
                      item.badge === "URGENT" &&
                        styles.urgentBadge,
                    ]}
                  >
                    <Text style={styles.badgeText}>
                      {item.badge}
                    </Text>
                  </View>
                )}

                <TouchableOpacity>
                  <Text style={styles.actionText}>
                    {item.actionText}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListFooterComponent={() => (
          <View style={styles.footer}>
            <Ionicons
              name="notifications-off"
              size={50}
              color="#D1D5DB"
            />

            <Text style={styles.footerText}>
              No more notifications for today
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F3FF",
    paddingHorizontal: 16,
    // paddingTop: 16,
  },

  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // paddingTop: -10,
    marginTop: -26,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
  },

  subtitle: {
    marginTop: 4,
    color: "#6B7280",
    marginBottom: 20,
  },

  markAll: {
    color: "#0070EB",
    fontWeight: "600",
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#ECECF3",
  },

  urgentCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#DC2626",
  },

  iconContainer: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  content: {
    flex: 1,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    flex: 1,
  },

  time: {
    fontSize: 12,
    color: "#6B7280",
  },

  message: {
    marginTop: 6,
    color: "#4B5563",
    lineHeight: 20,
  },

  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    gap: 10,
  },

  badge: {
    backgroundColor: "#DBEAFE",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },

  urgentBadge: {
    backgroundColor: "#FEE2E2",
  },

  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#0070EB",
  },

  actionText: {
    color: "#0070EB",
    fontWeight: "600",
    fontSize: 13,
  },

  footer: {
    alignItems: "center",
    marginTop: 40,
  },

  footerText: {
    marginTop: 12,
    color: "#9CA3AF",
  },
});