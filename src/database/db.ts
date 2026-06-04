import * as SQLite from "expo-sqlite";

export const db = SQLite.openDatabaseSync(
  "itams.db"
);

export const initDatabase = async () => {
  try {

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS users (
        employee_id TEXT PRIMARY KEY NOT NULL,
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

    console.log("Database initialized successfully");

  } catch (error) {

    console.log("Database initerror:",error );
  }
};