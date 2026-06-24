export interface Expense {
  id: string;
  title: string;
  expense_type: string;
  cost: number;
  status: "requested" | "approved" | "canceled";
  description: string;
  expense_date: string;
  remark: string | null;
}