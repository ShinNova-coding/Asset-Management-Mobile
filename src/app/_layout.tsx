import { useFonts } from "expo-font";
import * as Notifications from "expo-notifications";
import { Redirect, Stack, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useRef } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { NotificationProvider, useNotifications } from "../context/NotificationContext";
import { ThemeProvider, useTheme } from "../context/ThemeContext";
import { initDatabase } from "../database/db";
import { insertNotification } from "../database/notification.service";
import { createNotificationChannel, registerForPushNotifications } from "../services/notification.service";
import { NotificationType } from "../types/notification";

SplashScreen.preventAutoHideAsync();

// Helper function to process notification text payloads cleanly
const processAndSaveNotification = async (title: string, message: string, callback?: () => void) => {
  const lowerTitle = title.toLowerCase();
  let type: NotificationType = "maintenance_returned";

  if (lowerTitle.includes("maintenance returned")) {
    type = "maintenance_returned";
  } else if (lowerTitle.includes("maintenance approved")) {
    type = "maintenance_approved";
  } else if (lowerTitle.includes("maintenance canceled")) {
    type = "maintenance_canceled";
  } else if (lowerTitle.includes("expense approved")) {
    type = "expense_approved";
  } else if (lowerTitle.includes("expense canceled")) {
    type = "expense_canceled";
  } else if (lowerTitle.includes("asset assigned")) {
    type = "asset_assigned";
  }

  await insertNotification({
    title,
    message,
    type,
    is_read: 0,
    created_at: new Date().toISOString(),
  });
  
  if (callback) {
    await callback();
  }
};

// 1. This listener component sits directly inside the Provider so it NEVER unmounts or redirects
function NotificationListenerBridge() {
  const { updateUnreadCount } = useNotifications();
  const lastNotificationResponse = Notifications.useLastNotificationResponse();
  const hasProcessedColdStart = useRef(false);

  useEffect(() => {
    // Foreground streams
    const receivedSubscription = Notifications.addNotificationReceivedListener(
      async (notification) => {
        const title = notification.request.content.title || "";
        const message = notification.request.content.body || "";
        console.log("Foreground Notification captured successfully:", title);
        await processAndSaveNotification(title, message, updateUnreadCount);
      }
    );

    // Background runtime taps
    const responseSubscription = Notifications.addNotificationResponseReceivedListener(
      async (response) => {
        const title = response.notification.request.content.title || "";
        const message = response.notification.request.content.body || "";
        console.log("Notification tapped in background state:", title);
        await processAndSaveNotification(title, message, updateUnreadCount);
      }
    );

    return () => {
      receivedSubscription.remove();
      responseSubscription.remove();
    };
  }, [updateUnreadCount]);

  // Cold start processing
  useEffect(() => {
    if (
      lastNotificationResponse && 
      lastNotificationResponse.actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER &&
      !hasProcessedColdStart.current
    ) {
      hasProcessedColdStart.current = true;
      const title = lastNotificationResponse.notification.request.content.title || "";
      const message = lastNotificationResponse.notification.request.content.body || "";
      console.log("Cold start notification caught:", title);
      processAndSaveNotification(title, message, updateUnreadCount);
    }
  }, [lastNotificationResponse, updateUnreadCount]);

  return null; // Invisible bridge component, runs purely for background logic hooks
}

function RootNavigator() {
  const { token, isLoading: authLoading, user } = useAuth();
  const { isLoading: themeLoading } = useTheme();
  const segments = useSegments();

  // Push token registration bound safely to session validation states
  useEffect(() => {
    if (token && user) {
      registerForPushNotifications();
    }
  }, [token, user]);

  if (authLoading || themeLoading) {
    return null;
  }

  const inAuthGroup = segments[0] === "(auth)";

  if (!token && !inAuthGroup) {
    return <Redirect href="/(auth)/login" />;
  }
  if (token && user && inAuthGroup) {
    return <Redirect href="/(main)/(tabs)" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    async function prepare() {
      try {
        await initDatabase();
        await createNotificationChannel();
        if (loaded) {
          await SplashScreen.hideAsync();
        }
      } catch (error) {
        console.log("Core initialization failed:", error);
      }
    }
    prepare();
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <ThemeProvider>
          <NotificationProvider>
            {/* The bridge intercepts streams globally without interfering with auth redirects */}
            <NotificationListenerBridge />
            <RootNavigator />
          </NotificationProvider>
        </ThemeProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}