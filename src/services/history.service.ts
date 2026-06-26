import { api } from "../api/client";

export async function getAssignmentHistory() {
  const response = await api.get(
    "/assignment/history"
  );

  return response.data.data;
}

export async function getMaintenanceHistory() {
  const response = await api.get(
    "/maintenance/asset"
  );
  console.log("REPAIR History==>", response.data.data)
  return response.data.data;
}