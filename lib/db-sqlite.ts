import Database from "better-sqlite3";
import path from "path";

// Create SQLite database file in the project root
const dbPath = path.join(process.cwd(), "database.sqlite");
const db = new Database(dbPath);

// Initialize the database table
export function initDatabase() {
  try {
    db.exec(`
      CREATE TABLE IF NOT EXISTS images (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        image_path TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('SQLite database table "images" is ready');
    return Promise.resolve();
  } catch (error) {
    console.error("Error initializing SQLite database:", error);
    return Promise.reject(error);
  }
}

// Insert a new image record
export function insertImage(title: string, imagePath: string) {
  try {
    const stmt = db.prepare(
      "INSERT INTO images (title, image_path) VALUES (?, ?)"
    );
    const result = stmt.run(title, imagePath);

    // Get the inserted record
    const getStmt = db.prepare("SELECT * FROM images WHERE id = ?");
    const insertedRecord = getStmt.get(result.lastInsertRowid);

    return Promise.resolve(insertedRecord);
  } catch (error) {
    console.error("Error inserting image into SQLite:", error);
    return Promise.reject(error);
  }
}

// Get all images
export function getAllImages() {
  try {
    const stmt = db.prepare("SELECT * FROM images ORDER BY created_at DESC");
    const rows = stmt.all();
    return Promise.resolve(rows);
  } catch (error) {
    console.error("Error fetching images from SQLite:", error);
    return Promise.reject(error);
  }
}

// Close database connection when the process exits
process.on("exit", () => {
  db.close();
});

process.on("SIGINT", () => {
  db.close();
  process.exit(0);
});

export default db;
