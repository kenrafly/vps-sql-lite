import { NextResponse } from "next/server";
import { getAllImages, initDatabase } from "@/lib/db";

export async function GET() {
  try {
    // Initialize database
    await initDatabase();

    // Get all images from database
    const images = await getAllImages();

    return NextResponse.json({
      success: true,
      images: images,
    });
  } catch (error) {
    console.error("Error fetching images:", error);
    return NextResponse.json(
      { error: "Failed to fetch images" },
      { status: 500 }
    );
  }
}
