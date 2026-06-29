import { useFonts } from "expo-font";
import * as Notifications from "expo-notifications";
import { Redirect, Stack, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useRef } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { api } from "../api/client";
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
  const lowerMessage = message.toLowerCase();
  const combined = `${lowerTitle} ${lowerMessage}`;
  let type: NotificationType = "maintenance_returned";

  if (combined.includes("maintenance") && (combined.includes("return") || combined.includes("returned"))) {
    type = "maintenance_returned";
  } else if (combined.includes("maintenance") && combined.includes("approved")) {
    type = "maintenance_approved";
  } else if (combined.includes("maintenance") && (combined.includes("cancel") || combined.includes("canceled") || combined.includes("rejected"))) {
    type = "maintenance_canceled";
  } else if (combined.includes("expense") && combined.includes("approved")) {
    type = "expense_approved";
  } else if (combined.includes("expense") && (combined.includes("cancel") || combined.includes("canceled") || combined.includes("rejected"))) {
    type = "expense_canceled";
  } else if (combined.includes("asset") && combined.includes("assigned")) {
    type = "asset_assigned";
  }

  console.log("Notification matched type:", type, "from title:", title);

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
    console.log("Notification listeners registered");
    // Foreground streams
    const receivedSubscription = Notifications.addNotificationReceivedListener(
      async (notification) => {
        const title = notification.request.content.title || "";
        const message = notification.request.content.body || "";
        const data = notification.request.content.data || {};
        const finalTitle = title || (data as any).title || "";
        const finalMessage = message || (data as any).message || (data as any).body || "";
        console.log("Foreground Notification captured:", finalTitle, finalMessage, data);
        if (finalTitle || finalMessage) {
          await processAndSaveNotification(finalTitle, finalMessage, updateUnreadCount);
        }
      }
    );

    // Background runtime taps
    const responseSubscription = Notifications.addNotificationResponseReceivedListener(
      async (response) => {
        const title = response.notification.request.content.title || "";
        const message = response.notification.request.content.body || "";
        const data = response.notification.request.content.data || {};
        const finalTitle = title || (data as any).title || "";
        const finalMessage = message || (data as any).message || (data as any).body || "";
        console.log("Notification tapped:", finalTitle, finalMessage, data);
        if (finalTitle || finalMessage) {
          await processAndSaveNotification(finalTitle, finalMessage, updateUnreadCount);
        }
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
      registerForPushNotifications().then((pushToken) => {
        if (pushToken) {
          api.post("/save-fcm-token", { fcm_token: pushToken }).catch(() => {});
        }
      });
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