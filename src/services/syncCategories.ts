import { saveCategories } from "../database/category.service";

const BASE_URL =
  "http://192.168.100.197:1010";

export async function syncCategories(
  token: string
) {

  try {

    const response = await fetch(
      `${BASE_URL}/api/category`,
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

      await saveCategories(
        json.data
      );

      console.log(
        "Categories synced successfully"
      );
    }

  } catch (error) {

    console.log(
      "SYNC CATEGORIES ERROR:",
      error
    );
  }
}