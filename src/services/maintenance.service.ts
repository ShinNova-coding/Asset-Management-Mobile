import { api } from "../api/client";

export const submitMaintenanceRequest = async (
  data: {
    assets_id: string;
    status: string;
    issue_type: string;
    problem_description: string;
    evidence_image: string;
  }
) => {
    
  const response = await api.post(
    "/maintenance/status",
    data
  );

  return response.data;
};