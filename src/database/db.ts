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
        preview_url TEXT
      );
    `);

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS assets (
        asset_id TEXT PRIMARY KEY NOT NULL,
        name TEXT,
        serial_number TEXT,
        purchased_date TEXT,
        warranty_period INTEGER,
        model TEXT,
        ram_capacity TEXT,
        storage TEXT,
        category_id INTEGER,
        category_name TEXT,
        status TEXT,
        asset_condition TEXT,
        image_url TEXT,
        preview_url TEXT,
        created_at TEXT,
        updated_at TEXT
      );
    `);

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS assignments (
        id INTEGER PRIMARY KEY NOT NULL,
        employee_id TEXT,
        asset_id TEXT,
        note TEXT,
        status TEXT,
        assigned_date TEXT,
        returned_date TEXT
      );
    `);

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY NOT NULL,
        name TEXT
      );
    `);

    console.log("Database initialized successfully");

  } catch (error) {

    console.log("Database initerror:",error );
  }
};