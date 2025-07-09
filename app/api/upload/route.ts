import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { insertImage, initDatabase } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    // Initialize database
    await initDatabase();

    // Get form data from request
    const formData = await req.formData();

    // Extract title
    const title = formData.get("title") as string;

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    // Extract image file
    const imageFile = formData.get("image") as File;

    if (!imageFile) {
      return NextResponse.json(
        { error: "Image file is required" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!imageFile.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Please upload a valid image file" },
        { status: 400 }
      );
    }

    // Validate file size (10MB)
    if (imageFile.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Image must be smaller than 10MB" },
        { status: 400 }
      );
    }

    // Generate unique filename
    const fileExtension = path.extname(imageFile.name);
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}${fileExtension}`;
    const uploadPath = path.join(process.cwd(), "public", "uploads", fileName);

    // Convert file to buffer and save
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });

    // Write file
    await fs.writeFile(uploadPath, buffer);

    // Save to database
    const imagePath = `/uploads/${fileName}`;
    const savedImage = await insertImage(title, imagePath);

    return NextResponse.json({
      success: true,
      message: "Image uploaded successfully!",
      image: savedImage,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}
