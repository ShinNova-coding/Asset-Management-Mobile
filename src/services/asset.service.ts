import { api } from "../api/client";

export async function getAssignedAssets() {
   try {
   const response = await api.get(`/assignment/asset`);
   // console.log("ASSIGNED ASSETS RESPONSE:", response.data.data);
   return response.data.data;
   
   }
   catch (error: any){
      console.log( "GET ASSIGNED ASSETS ERROR:", error?.response?.status, error?.response?.data);
      throw error;
   }
}

export async function getAssetById(id: string) {

  const response = await api.get("/asset/id", {params: {id}});
  return response.data.data;
}





