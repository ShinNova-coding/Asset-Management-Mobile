import Header from "@/src/components/Header";
import { useNotifications } from "@/src/context/NotificationContext";
import { useTheme } from "@/src/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { Tabs, useFocusEffect } from "expo-router";
import { useCallback } from "react";

export default function TabsLayout() {
  const {colors, isDark} = useTheme();
  const {unreadCount, updateUnreadCount} = useNotifications();

  useFocusEffect(
    useCallback(() => {
      updateUnreadCount();
    }, [updateUnreadCount])
  );

  return (

    <Tabs
      screenOptions={{
        header: () => <Header />,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: isDark? "#94A3B8" : "#999",
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          height: 60,
          paddingBottom: 8,
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="home"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="expenses"
        options={{
          title: "Expenses",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="receipt"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="notifications"
        options={{
          title: "Notifications",
          tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: "#EF4444",
            fontSize: 11,
            fontWeight: "bold",
            minWidth: 18,
            height: 18,
            lineHeight: 18,
            paddingHorizontal: 4,
          },
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="notifications"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="person"
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* <Tabs.Screen
        name="assets/[id]"
        options={{
          href: null, 
          headerShown: false, 
        }}
      /> */}

    </Tabs>
    
  );
}