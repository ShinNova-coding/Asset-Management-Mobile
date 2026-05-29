import { api } from "../api/client";
import { saveProfile } from "../database/profile.service";

export async function syncProfile(
  token: string
) {

  try {

    const response = await fetch(
      `${api}/profile`,
      {
        method: "GET",

        headers: {
          Accept: "application/json",

          Authorization:
            `Bearer ${token}`,
        },
      }
    );

    const json = await response.json();

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