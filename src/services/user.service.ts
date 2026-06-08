import { api } from "../api/client";
export async function getUser(userId: string) {
  const response = await api.get(`/user/${userId}`);

  console.log("RAW USER RESPONSE:", response.data);

  return response.data?.data ?? response.data;
}