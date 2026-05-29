import { db } from "./db";

export async function saveProfile(
  user: any
) {

  try {

    await db.runAsync(
      `
      INSERT OR REPLACE INTO users (
        employee_id,
        name,
        email,
        position,
        status,
        phone_number,
        joined_date,
        image_url,
        preview_url
      )

      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        user.employee_id,
        user.name,
        user.email,
        user.position,
        user.status,
        user.phone_number,
        user.joined_date,
        user.image_url?.replace(
          "http://localhost",
          "http://192.168.100.197:1010"
        ),
        user.preview_url?.replace(
          "http://localhost",
          "http://192.168.100.197:1010"
        ),
      ]
    );

    console.log(
      "Profile saved locally"
    );

  } catch (error) {

    console.log(
      "SAVE PROFILE ERROR:",
      error
    );
  }
}

export async function getProfile() {

  try {

    const result =
      await db.getFirstAsync(`
        SELECT * FROM users LIMIT 1
      `);

    return result;

  } catch (error) {

    console.log(
      "GET PROFILE ERROR:",
      error
    );

    return null;
  }
}