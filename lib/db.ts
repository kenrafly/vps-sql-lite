import Database from "better-sqlite3";
import path from "path";

// Database record interface
export interface ImageRecord {
  id: number;
  title: string;
  image_path: string;
  created_at: string;
}

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
export function insertImage(
  title: string,
  imagePath: string
): Promise<ImageRecord> {
  try {
    const stmt = db.prepare(
      "INSERT INTO images (title, image_path) VALUES (?, ?)"
    );
    const result = stmt.run(title, imagePath);

    // Get the inserted record
    const getStmt = db.prepare("SELECT * FROM images WHERE id = ?");
    const insertedRecord = getStmt.get(result.lastInsertRowid) as ImageRecord;

    return Promise.resolve(insertedRecord);
  } catch (error) {
    console.error("Error inserting image into SQLite:", error);
    return Promise.reject(error);
  }
}

// Get all images
export function getAllImages(): Promise<ImageRecord[]> {
  try {
    const stmt = db.prepare("SELECT * FROM images ORDER BY created_at DESC");
    const rows = stmt.all() as ImageRecord[];
    return Promise.resolve(rows);
  } catch (error) {
    console.error("Error fetching images from SQLite:", error);
    return Promise.reject(error);
  }
}

// Update an image record
export function updateImage(id: number, title: string): Promise<ImageRecord> {
  try {
    const stmt = db.prepare("UPDATE images SET title = ? WHERE id = ?");
    const result = stmt.run(title, id);

    if (result.changes === 0) {
      return Promise.reject(new Error("Image not found"));
    }

    // Get the updated record
    const getStmt = db.prepare("SELECT * FROM images WHERE id = ?");
    const updatedRecord = getStmt.get(id) as ImageRecord;

    return Promise.resolve(updatedRecord);
  } catch (error) {
    console.error("Error updating image in SQLite:", error);
    return Promise.reject(error);
  }
}

// Delete an image record
export function deleteImage(id: number): Promise<ImageRecord> {
  try {
    // First get the image record to return the file path
    const getStmt = db.prepare("SELECT * FROM images WHERE id = ?");
    const imageRecord = getStmt.get(id) as ImageRecord;

    if (!imageRecord) {
      return Promise.reject(new Error("Image not found"));
    }

    // Delete from database
    const deleteStmt = db.prepare("DELETE FROM images WHERE id = ?");
    const result = deleteStmt.run(id);

    if (result.changes === 0) {
      return Promise.reject(new Error("Failed to delete image"));
    }

    return Promise.resolve(imageRecord);
  } catch (error) {
    console.error("Error deleting image from SQLite:", error);
    return Promise.reject(error);
  }
}

// Get a single image by ID
export function getImageById(id: number): Promise<ImageRecord> {
  try {
    const stmt = db.prepare("SELECT * FROM images WHERE id = ?");
    const image = stmt.get(id) as ImageRecord;

    if (!image) {
      return Promise.reject(new Error("Image not found"));
    }

    return Promise.resolve(image);
  } catch (error) {
    console.error("Error fetching image from SQLite:", error);
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
