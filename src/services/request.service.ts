import { api } from "../api/client";

export async function requestAsset(
  assetId: string,
  note: string
) {
  const response = await api.post(
    `/asset/${assetId}/request`,
    {
      note,
    }
  );

  return response.data;
}

export async function returnAsset(assetId: string) {
  const response = await api.post("/asset-return", {asset_id: assetId,});

  return response.data;
}