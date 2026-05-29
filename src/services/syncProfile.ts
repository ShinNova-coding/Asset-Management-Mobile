import { saveProfile } from "../database/profile.service";
import { BASE_URL } from "../URL/api";

export async function syncProfile(
  token: string
) {

  try {

    const response = await fetch(
      `${BASE_URL}/profile`,
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