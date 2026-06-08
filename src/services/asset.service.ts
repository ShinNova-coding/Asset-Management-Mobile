import { api } from "../api/client";

export async function getAssets() {
   const response = await api.get("/asset");
   return response.data.data?.data ?? [];
}

export async function getAssetById(id: string) {
  const response = await api.get(`/asset/${id}`);
  return response.data.data;
}

export async function getAssignedAssets() {
   const response = await api.get(`/assignment/asset`);
   return response.data.data;
}






