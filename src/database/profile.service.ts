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
        id,
        employee_id,
        name,
        email,
        position,
        status,
        phone_number,
        joined_date,
        image_url,
        preview_url,
        local_image_path,
        roles
      )

      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        user.id,
        user.employee_id,
        user.name,
        user.email,
        user.position,
        user.status,
        user.phone_number,
        user.joined_date,
        user.image_url,
        user.preview_url,
        user.local_image_path,
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