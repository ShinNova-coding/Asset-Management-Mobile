import { api } from "../api/client";

export async function getAssignmentHistory() {
  const response = await api.get(
    "/assignment/history"
  );

  return response.data.data;
}

export async function getMaintenanceHistory() {
  const response = await api.get(
    "/maintenance/history"
  );

  return response.data.data;
}