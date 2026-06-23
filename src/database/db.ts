import * as SQLite from "expo-sqlite";

export const db = SQLite.openDatabaseSync("itams.db");

export const initDatabase = async () => {
  try {


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
        local_image_path TEXT,
        roles TEXT
      );
    `);

    // const columns = await db.getAllAsync(`
    //   PRAGMA table_info(users);
    // `);

    // console.log("USERS TABLE:", columns);

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        type TEXT NOT NULL,
        is_read INTEGER DEFAULT 0,
        created_at TEXT NOT NULL
      );
    `);

    console.log("Database initialized successfully with primary key ID");

  } catch (error) {

    console.log("Database initerror:",error );
  }
};