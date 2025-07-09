// Test PostgreSQL connection and setup
const { Pool } = require("pg");
require("dotenv").config({ path: ".env.local" });

const pool = new Pool({
  user: process.env.POSTGRES_USER || "postgres",
  host: process.env.POSTGRES_HOST || "localhost",
  database: process.env.POSTGRES_DB || "image_gallery",
  password: process.env.POSTGRES_PASSWORD || "password",
  port: parseInt(process.env.POSTGRES_PORT || "5432"),
});

async function testConnection() {
  try {
    console.log("🔍 Testing PostgreSQL connection...");
    const client = await pool.connect();

    // Test basic connectivity
    const result = await client.query("SELECT NOW()");
    console.log("✅ Connection successful!");
    console.log("📅 Server time:", result.rows[0].now);

    // Create the images table
    console.log("📋 Creating images table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS images (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        image_path TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✅ Images table ready!");

    // Check if table exists and show structure
    const tableInfo = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'images'
      ORDER BY ordinal_position
    `);

    console.log("📊 Table structure:");
    tableInfo.rows.forEach((row) => {
      console.log(
        `  - ${row.column_name}: ${row.data_type} (${
          row.is_nullable === "YES" ? "nullable" : "not null"
        })`
      );
    });

    client.release();
    console.log("🎉 PostgreSQL setup complete!");
  } catch (error) {
    console.error("❌ Connection failed:", error.message);
    console.error(
      "\n💡 Make sure PostgreSQL is running and the database exists."
    );
    console.error("💡 Check your .env.local file configuration.");
    process.exit(1);
  } finally {
    await pool.end();
  }
}

testConnection();
