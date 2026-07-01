import { useNotifications } from "@/src/context/NotificationContext";
import { useTheme } from "@/src/context/ThemeContext";
import {
  deleteNotification as deleteNotificationDB,
  getNotifications,
  markAllAsRead as markAllAsReadDB
} from "@/src/database/notification.service";
import { NotificationItem, NotificationType } from "@/src/types/notification";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  RefreshControl,
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

  const { updateUnreadCount, reloadKey } = useNotifications();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const { colors, isDark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    await updateUnreadCount();
    setRefreshing(false);
  };

  const loadNotifications = async () => {
  const data = await getNotifications();

    setNotifications(data);
  };

  const handleDelete = async (id: number) => {

  try {
  await deleteNotificationDB(id);

  await updateUnreadCount();

  loadNotifications();

 }catch (error) {
      console.log("Failed to delete notification:", error);
    }
};

const handleMarkAllRead = async () => {
  await markAllAsReadDB();
  loadNotifications();
};

    useFocusEffect(
      useCallback(() => {
        loadNotifications();
        setLoading(false);
      }, [])
    );

    useEffect(() => {
      loadNotifications();
    }, [reloadKey]);

// const today = new Date();

// const getSection = (dateString: string) => {
//   const notificationDate = new Date(dateString);

//   const diffTime = today.getTime() - notificationDate.getTime();
//   const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

//   if (diffDays === 0) return "Today";
//   if (diffDays === 1) return "Yesterday";
//   if (diffDays <= 7) return "This Week";

//   return "Older";
// };

 const getSection = (dateString: string) => {
  const notificationDate = new Date(dateString);
  const today = new Date();

  if (
    notificationDate.toDateString() === today.toDateString()
  ) {
    return "Today";
  }

  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (
    notificationDate.toDateString() === yesterday.toDateString()
  ) {
    return "Yesterday";
  }

  // Beginning of this week (Monday)
  const firstDayOfWeek = new Date(today);
  const day = firstDayOfWeek.getDay();

  const diff =
    day === 0
      ? 6
      : day - 1;

  firstDayOfWeek.setDate(
    firstDayOfWeek.getDate() - diff
  );

  if (notificationDate >= firstDayOfWeek) {
    return "This Week";
  }

  return "Older";
};


const groupedNotifications = React.useMemo(() => {
  return ["Today", "Yesterday", "This Week", "Older"]
    .map(section => ({
      title: section,
      data: notifications.filter(
        item => getSection(item.created_at) === section
      ),
    }))
    .filter(section => section.data.length > 0);
}, [notifications]);

  
const renderIcon = (type: NotificationType) => {
  switch (type) {

    case "maintenance_returned":
      return (
        <View style={[styles.iconContainer,{backgroundColor:"#3B82F6"}]}>
          <Ionicons name="return-up-back" size={20} color="#fff"/>
        </View>
      );

    case "maintenance_approved":
      return (
        <View style={[styles.iconContainer,{backgroundColor:"#10B981"}]}>
          <Ionicons name="checkmark-circle" size={20} color="#fff"/>
        </View>
      );

    case "maintenance_canceled":
      return (
        <View style={[styles.iconContainer,{backgroundColor:"#EF4444"}]}>
          <Ionicons name="close-circle" size={20} color="#fff"/>
        </View>
      );

    case "expense_approved":
      return (
        <View style={[styles.iconContainer,{backgroundColor:"#16A34A"}]}>
          <Ionicons name="cash" size={20} color="#fff"/>
        </View>
      );

    case "expense_canceled":
      return (
        <View style={[styles.iconContainer,{backgroundColor:"#DC2626"}]}>
          <Ionicons name="wallet" size={20} color="#fff"/>
        </View>
      );

    case "asset_assigned":
      return (
        <View style={[styles.iconContainer,{backgroundColor:"#6366F1"}]}>
          <Ionicons name="briefcase" size={20} color="#fff"/>
        </View>
      );
  }
};

if (loading) {
    return <NotiSkeleton />;
  }

  return (
    <SafeAreaView style={[styles.container,{ backgroundColor: colors.background}]} edges={["top"]}>

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
        keyExtractor={(item) => item.id!.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 16,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
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