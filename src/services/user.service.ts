import { api } from "../api/client";
export async function getUser(employeeId: string) {
  const response = await api.get(`/user/${employeeId}`);
  return response.data.data;
}