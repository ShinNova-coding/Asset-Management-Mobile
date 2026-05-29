import { saveProfile } from "../database/profile.service";

const BASE_URL =
  "http://192.168.100.197:1010";

export async function syncProfile(
  token: string
) {

  try {

    const response = await fetch(
      `${BASE_URL}/api/profile`,
      {
        method: "GET",

        headers: {
          Accept: "application/json",

          Authorization:
            `Bearer ${token}`,
        },
      }
    );

    const json =
      await response.json();

    if (json.success) {

      await saveProfile(
        json.data
      );

      console.log(
        "Profile synced successfully"
      );
    }

  } catch (error) {

    console.log(
      "SYNC PROFILE ERROR:",
      error
    );
  }
}