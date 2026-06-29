import { NotificationItem } from "../types/notification";
import { db } from "./db";

export const insertNotification = async (
  notification: NotificationItem
) => {
  const fiveSecondsAgo = new Date(Date.now() - 5000).toISOString();
  const existing = await db.getFirstAsync<{ id: number }>(
    `SELECT id FROM notifications WHERE title = ? AND message = ? AND created_at > ?`,
    [notification.title, notification.message, fiveSecondsAgo]
  );
  if (existing) return;

  await db.runAsync(
    `
    INSERT INTO notifications
    (title,message,type,is_read,created_at)
    VALUES (?,?,?,?,?)
    `,
    [
      notification.title,
      notification.message,
      notification.type,
      notification.is_read,
      notification.created_at,
    ]
  );
};

export const getNotifications = async () => {
  return await db.getAllAsync<NotificationItem>(
    `
    SELECT *
    FROM notifications
    ORDER BY created_at DESC
    `
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

export const markAllAsRead = async () => {
  await db.runAsync(
    `
    UPDATE notifications
    SET is_read = 1
    `
  );
};

export const getUnreadCount = async (): Promise<number> => {
  const result = await db.getFirstAsync<{ count: number }>(
    `SELECT COUNT(*) as count FROM notifications WHERE is_read = 0`
  );
  return result?.count ?? 0;
};