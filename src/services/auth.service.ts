import { api } from "../api/client";

export async function logoutUser() {
  const response = await api.post("/logout");

  return response.data;
}