import { saveAssets } from "../database/asset.service";
import { BASE_URL } from "../URL/api";

export async function syncAssets(
  token: string
) {

  try {

    const response = await fetch(
      `${BASE_URL}/asset`,
      {
        method: "GET",

        headers: {
          Accept: "application/json",

          Authorization: `Bearer ${token}`,
        },
      }
    );

    const json = await response.json();

    if (json.success) {
        
      await saveAssets(
        json.data.data
      );

      console.log(
        "Assets synced successfully"
      );
    }

  } catch (error) {

    console.log(
      "SYNC ASSETS ERROR:",
      error
    );
  }
}