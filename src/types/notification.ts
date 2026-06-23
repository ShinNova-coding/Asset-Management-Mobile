export interface NotificationItem {
  id?: number;
  title: string;
  message: string;
  type: "assigned" | "repair";
  is_read: number;
  created_at: string;
}