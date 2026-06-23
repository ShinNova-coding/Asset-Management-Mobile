import { useTheme } from "@/src/context/ThemeContext";
import {
  deleteNotification as deleteNotificationDB,
  getNotifications,
  markAllAsRead as markAllAsReadDB
} from "@/src/database/notification.service";
import { NotificationItem } from "@/src/types/notification";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { SafeAreaView } from "react-native-safe-area-context";
import NotiSkeleton from "../../../components/skeletons/NotiSkeleton";

export default function NotificationScreen() {

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const { colors, isDark } = useTheme();
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
  const data = await getNotifications();
  setNotifications(data);
  };

  const handleDelete = async (id: number) => {
  await deleteNotificationDB(id);
  loadNotifications();
};

const handleMarkAllRead = async () => {
  await markAllAsReadDB();
  loadNotifications();
};

    useEffect(() => {
      
      loadNotifications();

      const timer = setTimeout(() => {
        setLoading(false);
      }, 1000);

      return () => clearTimeout(timer);
    }, []);

      if (loading) {
        return <NotiSkeleton />;
      }
  
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

  // const deleteNotification = (id: string) => {
  //   setNotifications((notifications) => notifications.filter((item) => item.id !== id));
  // }

  // const markAllAsRead = () => {
  //   setNotifications((notifications) => notifications.map((item)=> ({ ...item, unread: false})));
  // }
  const groupedNotifications = [
  {
    title: "Today",
    data: notifications.filter(
      (item) => item.section === "Today"
    ),
  },

  {
    title: "Yesterday",
    data: notifications.filter(
      (item) => item.section === "Yesterday"
    ),
  },

  {
    title: "This Week",
    data: notifications.filter(
      (item) => item.section === "This Week"
    ),
  },
];

  return (
    <SafeAreaView style={[styles.container,{ backgroundColor: colors.background}]}>

      <View style={styles.titleRow}>
        <Text style={[styles.title, {color: colors.text}]}>Notifications</Text>

        <TouchableOpacity onPress={handleMarkAllRead}>
          <Text style={styles.markAll}>
            Mark all as read
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.subtitle, {color: colors.subText}]}>
        Stay updated on your IT assets
      </Text>

      <SectionList
        sections={groupedNotifications}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 120,
        }}
        renderSectionHeader={({ section })=> (
          <Text style= {[styles.sectionHeader, {color: colors.subText}]}>
            {section.title}
          </Text>
        )}
        renderItem={({ item }) => (
          <Swipeable
              renderRightActions={() => (
                <TouchableOpacity
                  onPress={() =>
                    handleDelete(item.id!)
                  }
                  style={styles.deleteAction}
                >
                  <Ionicons
                    name="trash-outline"
                    size={22}
                    color="white"
                  />

                  <Text style={styles.deleteText}>
                    Delete
                  </Text>
                </TouchableOpacity>
              )}
            >
          <TouchableOpacity
            activeOpacity={0.9}
            style={[
              styles.card, { backgroundColor: item.is_read === 0 ? isDark ? "#1E293B" : "#F8FBFF" : colors.card, borderColor: colors.background},
              // item.type === "urgent" && styles.urgentCard,
            ]}
          >
            {renderIcon(item.type)}

            <View style={styles.content}>
              <View style={styles.topRow}>
                <View style={styles.titleRowInner}>
                   {item.is_read===0 && (
                    <View style={styles.unreadDot} />
                   )}
                    <Text style={[styles.cardTitle, {color: colors.text}]}>
                      {item.title}
                    </Text>
                </View>
                <Text style={[styles.time, {color: colors.subText}]}>
                  {new Date(item.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </View>

              <Text style={[styles.message, {color: colors.text}]}>
                {item.message}
              </Text>
            </View>
          </TouchableOpacity>
          </Swipeable>
        )}
        ListFooterComponent={() => (
          <View style={styles.footer}>
            <Ionicons
              name="notifications-off"
              size={50}
              color="#D1D5DB"
            />
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
  },

  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
sectionHeader: {
  fontSize: 15,
  fontWeight: "700",
  marginBottom: 12,
  marginTop: 20,
},

titleRowInner: {
  flexDirection: "row",
  alignItems: "center",
  flex: 1,
},

unreadDot: {
  width: 8,
  height: 8,
  borderRadius: 4,
  backgroundColor: "#0070EB",
  marginRight: 8,
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
deleteAction: {
  width: 90,
  backgroundColor: "#EF4444",
  borderRadius: 18,
  marginBottom: 14,
  justifyContent: "center",
  alignItems: "center",
},

deleteText: {
  color: "white",
  fontWeight: "700",
  marginTop: 4,
},
  footer: {
    alignItems: "center",
    marginTop: 40,
  },
});