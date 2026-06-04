import { api } from "../api/client";


export async function returnAsset(assetId: string, employeeId: string) {
  const response = await api.post(`/assignment/${assetId}/return`, {employee_id: employeeId});

  return response.data;
}