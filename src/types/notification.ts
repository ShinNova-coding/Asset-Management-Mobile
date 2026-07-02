export type NotificationType =
  | "maintenance_returned"
  | "maintenance_approved"
  | "maintenance_canceled"
  | "expense_approved"
  | "expense_canceled"
  | "asset_assigned";

export interface NotificationItem {
  id?: number;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  is_read: number;
  created_at: string;
}