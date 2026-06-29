import { useFonts } from "expo-font";
import * as Notifications from "expo-notifications";
import { Redirect, Stack, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { NotificationProvider, useNotifications } from "../context/NotificationContext";
import { ThemeProvider, useTheme } from "../context/ThemeContext";
import { initDatabase } from "../database/db";
import { insertNotification } from "../database/notification.service";
import { createNotificationChannel } from "../services/notification.service";
import { NotificationType } from "../types/notification";

SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { token, isLoading: authLoading, user } = useAuth();
  const { isLoading: themeLoading } = useTheme();
  
  // 1. We extract this hook here, inside the consumer layer where NotificationProvider is active
  const { updateUnreadCount } = useNotifications();
  const segments = useSegments();

  // 2. The entire Notification Listener block safely lives here now
  useEffect(() => {
    const receivedSubscription = Notifications.addNotificationReceivedListener(
      async (notification) => {
        const title = notification.request.content.title || "";
        const message = notification.request.content.body || "";
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

        // Save to your local SQLite DB
        await insertNotification({
          title,
          message,
          type,
          is_read: 0,
          created_at: new Date().toISOString(),
        });
        
        console.log("Notification saved to DB");

        // Force the global state provider to update the tab badge count instantly
        await updateUnreadCount();
      }
    );

    const responseSubscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log("User tapped notification:", response);
      }
    );

    return () => {
      receivedSubscription.remove();
      responseSubscription.remove();
    };
  }, [updateUnreadCount]);

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

  // Base initialization loop remains pristine down here
  useEffect(() => {
    async function prepare() {
      try {
        await initDatabase();
        await createNotificationChannel();
        if (loaded) {
          await SplashScreen.hideAsync();
        }
      } catch (error) {
        console.log(error);
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
            <RootNavigator />
          </NotificationProvider>
        </ThemeProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}