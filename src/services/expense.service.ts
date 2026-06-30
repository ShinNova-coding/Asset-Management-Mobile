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
  // console.log("expanse ===>",response)

  return response.data.data;
};