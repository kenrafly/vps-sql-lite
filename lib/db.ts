import { Pool, PoolClient } from "pg";

// Database record interface
export interface ImageRecord {
  id: number;
  title: string;
  image_path: string;
  created_at: string;
}

// Create PostgreSQL connection pool
const pool = new Pool({
  user: process.env.POSTGRES_USER || "postgres",
  host: process.env.POSTGRES_HOST || "localhost",
  database: process.env.POSTGRES_DB || "image_gallery",
  password: process.env.POSTGRES_PASSWORD || "password",
  port: parseInt(process.env.POSTGRES_PORT || "5433"),
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Initialize the database table
export async function initDatabase(): Promise<void> {
  const client: PoolClient = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS images (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        image_path TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('PostgreSQL database table "images" is ready');
  } catch (error) {
    console.error("Error initializing PostgreSQL database:", error);
    throw error;
  } finally {
    client.release();
  }
}

// Insert a new image record
export async function insertImage(
  title: string,
  imagePath: string
): Promise<ImageRecord> {
  const client: PoolClient = await pool.connect();
  try {
    const result = await client.query(
      "INSERT INTO images (title, image_path) VALUES ($1, $2) RETURNING *",
      [title, imagePath]
    );

    return result.rows[0] as ImageRecord;
  } catch (error) {
    console.error("Error inserting image into PostgreSQL:", error);
    throw error;
  } finally {
    client.release();
  }
}

// Get all images
export async function getAllImages(): Promise<ImageRecord[]> {
  const client: PoolClient = await pool.connect();
  try {
    const result = await client.query(
      "SELECT * FROM images ORDER BY created_at DESC"
    );
    return result.rows as ImageRecord[];
  } catch (error) {
    console.error("Error fetching images from PostgreSQL:", error);
    throw error;
  } finally {
    client.release();
  }
}

// Update an image record
export async function updateImage(
  id: number,
  title: string
): Promise<ImageRecord> {
  const client: PoolClient = await pool.connect();
  try {
    const result = await client.query(
      "UPDATE images SET title = $1 WHERE id = $2 RETURNING *",
      [title, id]
    );

    if (result.rows.length === 0) {
      throw new Error("Image not found");
    }

    return result.rows[0] as ImageRecord;
  } catch (error) {
    console.error("Error updating image in PostgreSQL:", error);
    throw error;
  } finally {
    client.release();
  }
}

// Delete an image record
export async function deleteImage(id: number): Promise<ImageRecord> {
  const client: PoolClient = await pool.connect();
  try {
    // First get the image record to return the file path
    const selectResult = await client.query(
      "SELECT * FROM images WHERE id = $1",
      [id]
    );

    if (selectResult.rows.length === 0) {
      throw new Error("Image not found");
    }

    const imageRecord = selectResult.rows[0] as ImageRecord;

    // Delete from database
    const deleteResult = await client.query(
      "DELETE FROM images WHERE id = $1",
      [id]
    );

    if (deleteResult.rowCount === 0) {
      throw new Error("Failed to delete image");
    }

    return imageRecord;
  } catch (error) {
    console.error("Error deleting image from PostgreSQL:", error);
    throw error;
  } finally {
    client.release();
  }
}

// Get a single image by ID
export async function getImageById(id: number): Promise<ImageRecord> {
  const client: PoolClient = await pool.connect();
  try {
    const result = await client.query("SELECT * FROM images WHERE id = $1", [
      id,
    ]);

    if (result.rows.length === 0) {
      throw new Error("Image not found");
    }

    return result.rows[0] as ImageRecord;
  } catch (error) {
    console.error("Error fetching image from PostgreSQL:", error);
    throw error;
  } finally {
    client.release();
  }
}

// Close database connection pool when the process exits
process.on("exit", () => {
  pool.end();
});

process.on("SIGINT", () => {
  pool.end();
  process.exit(0);
});

export { pool };
export default pool;
