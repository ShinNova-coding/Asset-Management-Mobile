import { API_URL } from "../api/client";
import { db } from "./db";

export async function saveProfile(user: any) {


     if (!user) {
    console.log("saveProfile received null/undefined user");
    return;
  }

    console.log("SAVE PROFILE DATA:", user);
    await db.runAsync(`
      DELETE FROM users`);


    await db.runAsync(
      `
      INSERT INTO users (
        employee_id,
        name,
        email,
        position,
        status,
        phone_number,
        joined_date,
        image_url,
        preview_url,
        roles
      )

      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
          API_URL
        ),
        user.preview_url?.replace(
          "http://localhost",
          API_URL
        ),
        user.roles ? JSON.stringify(user.roles) : null,
      ]
    );

    console.log("Profile saved locally");
}

export async function getProfile() {

  try {

    const result =
      await db.getFirstAsync<any>(`
        SELECT * FROM users LIMIT 1
      `);
      if (!result) return null;

    console.log("USERS FROM SQLITE:", result);
     
    return {
    ...result,
    roles: result.roles ? JSON.parse(result.roles) : [{ id: 0, name: result.position || "Employee" }]
  };

  } catch (error) {

    console.log(
      "GET PROFILE ERROR:",
      error
    );

    return null;
  }
}