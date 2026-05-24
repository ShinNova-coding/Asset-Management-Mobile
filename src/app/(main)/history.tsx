import HeaderBar from "@/src/components/HeaderBar";
import { useTheme } from "@/src/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const activities = [
  {
    id: 1,
    type: "return",
    title: "Returned Asset",
    asset: "MacBook Pro M3",
    time: "Today • 10:25 AM",
  },

  {
    id: 2,
    type: "assignment",
    title: "Asset Assigned",
    asset: "iPhone 15 Pro",
    time: "Yesterday • 3:42 PM",
  },

  {
    id: 3,
    type: "issue",
    title: "Issue Reported",
    asset: "iPad Air",
    time: "2 days ago",
  },

  {
    id: 4,
    type: "assignment",
    title: "Asset Assigned",
    asset: "Dell Monitor",
    time: "May 18 • 11:12 AM",
  },
    {
    id: 5,
    type: "return",
    title: "Returned Asset",
    asset: "MacBook Pro M3",
    time: "Today • 10:25 AM",
  },

  {
    id: 6,
    type: "assignment",
    title: "Asset Assigned",
    asset: "iPhone 15 Pro",
    time: "Yesterday • 3:42 PM",
  },

  {
    id: 7,
    type: "issue",
    title: "Issue Reported",
    asset: "iPad Air",
    time: "2 days ago",
  },

  {
    id: 8,
    type: "assignment",
    title: "Asset Assigned",
    asset: "Dell Monitor",
    time: "May 18 • 11:12 AM",
  },
];

export default function HistoryScreen() {
  const { colors, isDark } = useTheme();

  const getActivityStyle = (type: string) => {
    switch (type) {
      case "return":
        return {
          icon: "return-up-back-outline",
          bg: "#FFF7ED",
          iconColor: "#F97316",
        };

      case "assignment":
        return {
          icon: "cube-outline",
          bg: "#EEF4FF",
          iconColor: "#0070EB",
        };

      case "issue":
        return {
          icon: "warning-outline",
          bg: "#FEF2F2",
          iconColor: "#EF4444",
        };

      default:
        return {
          icon: "time-outline",
          bg: "#F3F4F6",
          iconColor: "#6B7280",
        };
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
        title="History"
        backButtonAction={() => router.back()}
      />

      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            { color: colors.text },
          ]}
        >
          Recent Activities
        </Text>

        <Text
          style={[
            styles.subtitle,
            { color: colors.subText },
          ]}
        >
          Track your recent asset actions and requests.
        </Text>

        <FlatList
          data={activities}
          keyExtractor={(item) =>
            item.id.toString()
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 20,
            paddingTop: 15,
          }}
          renderItem={({ item }) => {
            const activityStyle =
              getActivityStyle(item.type);

            return (
              <View
                style={[
                  styles.activityCard,
                  {
                    backgroundColor: colors.card,
                  },
                ]}
              >
                <View
                  style={[
                    styles.iconContainer,
                    {
                      backgroundColor:
                        activityStyle.bg,
                    },
                  ]}
                >
                  <Ionicons
                    name={activityStyle.icon as any}
                    size={24}
                    color={
                      activityStyle.iconColor
                    }
                  />
                </View>

                <View style={styles.activityContent}>
                  <Text
                    style={[
                      styles.activityTitle,
                      { color: colors.text },
                    ]}
                  >
                    {item.title}
                  </Text>

                  <Text
                    style={[
                      styles.assetName,
                      { color: colors.text },
                    ]}
                  >
                    {item.asset}
                  </Text>

                  <Text style={styles.timeText}>
                    {item.time}
                  </Text>
                </View>
              </View>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
  },

  subtitle: {
    fontSize: 14,
    paddingBottom: 12,
    marginTop: 6,
  },

  activityCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 24,
    padding: 16,
    marginBottom: 10,
  },

  iconContainer: {
    width: 58,
    height: 58,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },

  activityContent: {
    flex: 1,
    marginLeft: 14,
  },

  activityTitle: {
    fontSize: 16,
    fontWeight: "700",
  },

  assetName: {
    fontSize: 15,
    marginTop: 5,
    fontWeight: "500",
  },

  timeText: {
    marginTop: 8,
    color: "#888",
    fontSize: 13,
    fontWeight: "500",
  },
});