
import { api } from "../api/client";


export async function returnAsset(assets_id: string) {

    console.log("RETURN ID:", assets_id);

  const response = await api.post("/assignment/return",{"asset_id": assets_id});

  console.log("RETURNED res===>",response)

  return response.data;
}