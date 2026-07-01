import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { insertNotification } from "../database/notification.service";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function syncMissedNotifications() {
  try {
    const deliveredNotifs = await Notifications.getPresentedNotificationsAsync();
    
    if (deliveredNotifs.length === 0) return;

    for (const notif of deliveredNotifs) {
      const title = notif.request.content.title || "";
      const message = notif.request.content.body || "";
      
      if (!title && !message) {
        await Notifications.dismissNotificationAsync(notif.request.identifier);
        continue;
      }

      const combined = `${title.toLowerCase()} ${message.toLowerCase()}`;
      let type: any = "maintenance_returned";
      
      if (combined.includes("maintenance") && (combined.includes("return") || combined.includes("returned"))) type = "maintenance_returned";
      else if (combined.includes("maintenance") && combined.includes("approved")) type = "maintenance_approved";
      else if (combined.includes("maintenance") && (combined.includes("cancel") || combined.includes("canceled") || combined.includes("rejected"))) type = "maintenance_canceled";
      else if (combined.includes("expense") && combined.includes("approved")) type = "expense_approved";
      else if (combined.includes("expense") && (combined.includes("cancel") || combined.includes("canceled") || combined.includes("rejected"))) type = "expense_canceled";
      else if (combined.includes("asset") && combined.includes("assigned")) type = "asset_assigned";

      await insertNotification({
        title,
        message,
        type,
        is_read: 0,
        created_at: new Date().toISOString(),
      });

      await Notifications.dismissNotificationAsync(notif.request.identifier);
    }
    
  } catch (error) {
    console.log("Error syncing notifications on startup:", error);
  }
}

export async function createNotificationChannel() {
  if (Platform.OS === "android") {
    try {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#0070EB",
      });
      console.log("Android notification channel created");
    } catch (e) {
      console.log("Failed to create notification channel:", e);
    }
  }
}

export async function registerForPushNotifications() {
  try {
    if (!Device.isDevice) {
      console.log("Must use physical device");
      return null;
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();

    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } =
        await Notifications.requestPermissionsAsync();

      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log("Permission denied");
      return null;
    }

    await createNotificationChannel();

    const token = await Notifications.getDevicePushTokenAsync();

    console.log("FCM TOKEN:", token.data);

    return token.data;
  } catch (e) {
    console.log("Push registration error:", e);
    return null;
  }
}
