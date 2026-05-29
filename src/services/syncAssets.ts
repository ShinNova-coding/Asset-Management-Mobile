import { saveAssets } from "../database/asset.service";

const BASE_URL =
  "http://192.168.100.197:1010";

export async function syncAssets(
  token: string
) {

  try {

    const response = await fetch(
      `${BASE_URL}/api/asset`,
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