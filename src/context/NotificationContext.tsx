import * as Notifications from "expo-notifications";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { AppState, AppStateStatus } from "react-native";
import { getUnreadCount as fetchUnreadCountFromDB } from "../database/notification.service";
import { syncMissedNotifications } from "../services/notification.service";

interface NotificationContextType {
  unreadCount: number;
  reloadKey: number;
  updateUnreadCount: () => Promise<void>;
  notifyNewNotification: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [reloadKey, setReloadKey] = useState(0);

  const notifyNewNotification = useCallback(() => {
    setReloadKey((k) => k + 1);
  }, []);

  const updateUnreadCount = useCallback(async () => {

    await syncMissedNotifications();

    const count = await fetchUnreadCountFromDB();

    setUnreadCount(count);

    try {
      await Notifications.setBadgeCountAsync(count);
    } catch (badgeError) {
      console.log("Could not set native badge count:", badgeError);
    }

  }, []);

  useEffect(() => {
    updateUnreadCount();
    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
      if (nextAppState === "active") {
        await updateUnreadCount();
      }
    };

    const subscription = AppState.addEventListener("change", handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [updateUnreadCount]);

  return (
    <NotificationContext.Provider value={{ unreadCount, reloadKey, updateUnreadCount, notifyNewNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}