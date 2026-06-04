import { api } from "../api/client";
export async function getUser(employeeId: string) {
  const response = await api.get(`/user/${employeeId}`);

  console.log("RAW USER RESPONSE:", response.data);

  return response.data?.data ?? response.data;
}