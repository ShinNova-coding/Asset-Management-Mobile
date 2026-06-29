import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

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