import { api } from "../api/client";

export const requestExpense = async (payload:any) => {

  const response = await api.post(
      "/expense/status",
      payload
  );

  return response.data;
};

export const getExpenses = async () => {
  const response = await api.get("/expense/asset");

  return response.data.data;
};