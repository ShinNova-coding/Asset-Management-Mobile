import { api } from "./client";

export async function fetchAssets() {
   const response = await api.get("/asset");
   return response.data;
}