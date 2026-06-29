import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getUnreadCount as fetchUnreadCountFromDB } from "../database/notification.service";

interface NotificationContextType {
  unreadCount: number;
  updateUnreadCount: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [unreadCount, setUnreadCount] = useState(0);

  const updateUnreadCount = useCallback(async () => {
    const count = await fetchUnreadCountFromDB();
    setUnreadCount(count);
  }, []);

  // Initial load on app boot
  useEffect(() => {
    updateUnreadCount();
  }, [updateUnreadCount]);

  return (
    <NotificationContext.Provider value={{ unreadCount, updateUnreadCount }}>
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