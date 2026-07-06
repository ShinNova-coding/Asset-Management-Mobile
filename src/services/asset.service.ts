import * as SecureStore from "expo-secure-store";
import { api } from "../api/client";

export async function getAssignedAssets() {
   try {

    const token = await SecureStore.getItemAsync("token");
   //  console.log("TOKEN =", token);

   const response = await api.get(`/assignment/asset`);
   return response.data.data || [];
   
   }catch (error: any){
      if (error?.response?.status === 404){
         return [];
      }
      // console.log( "GET ASSIGNED ASSETS ERROR:", error?.response?.status, error?.response?.data);
      throw error;
   }
}

export async function getAssetById(id: string) {

  const response = await api.get("/asset/id", {params: {id}});
  return response.data.data;
}





