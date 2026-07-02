import { NotificationItem } from "../types/notification";
import { db } from "./db";

export const insertNotification = async (
  notification: NotificationItem
) => {
  await db.runAsync(
    `
    INSERT INTO notifications
    (user_id,title,message,type,is_read,created_at)
    VALUES (?,?,?,?,?,?)
    `,
    [
      notification.user_id,
      notification.title,
      notification.message,
      notification.type,
      notification.is_read,
      notification.created_at,
    ]
  );
};

export const getNotifications = async (userId: string) => {
  return await db.getAllAsync<NotificationItem>(
    `
    SELECT *
    FROM notifications
    WHERE user_id = ?
    ORDER BY created_at DESC
    `,
    [userId]
  );
};

export const deleteNotification = async (id: number) => {
  await db.runAsync(
    `
    DELETE FROM notifications
    WHERE id = ?
    `,
    [id]
  );
};

export const markAllAsRead = async (userId: string) => {
  await db.runAsync(
    `
    UPDATE notifications
    SET is_read = 1 WHERE user_id = ?
    `,[userId]
  );
};

export const getUnreadCount = async (userId: string): Promise<number> => {
  const result = await db.getFirstAsync<{ count: number }>(
    `SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0`,
    [userId]
  );
  return result?.count ?? 0;
};