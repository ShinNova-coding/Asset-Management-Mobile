import * as SQLite from "expo-sqlite";

export const db = SQLite.openDatabaseSync("itams.db");

export const initDatabase = async () => {
  try {

    await db.execAsync(`
     DROP TABLE IF EXISTS users;
`);

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        employee_id TEXT,
        name TEXT,
        email TEXT,
        position TEXT,
        status TEXT,
        phone_number TEXT,
        joined_date TEXT,
        image_url TEXT,
        preview_url TEXT,
        roles TEXT
      );
    `);

    console.log("Database initialized successfully with primary key ID");

  } catch (error) {

    console.log("Database initerror:",error );
  }
};