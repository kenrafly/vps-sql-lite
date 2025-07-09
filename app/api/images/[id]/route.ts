import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { updateImage, deleteImage, getImageById, initDatabase } from "@/lib/db";

// GET /api/images/[id] - Get single image
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initDatabase();

    const { id: idParam } = await params;
    const id = parseInt(idParam);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid image ID" }, { status: 400 });
    }

    const image = await getImageById(id);
    return NextResponse.json({ success: true, image });
  } catch (error) {
    console.error("Error fetching image:", error);
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }
}

// PUT /api/images/[id] - Update image title
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initDatabase();

    const { id: idParam } = await params;
    const id = parseInt(idParam);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid image ID" }, { status: 400 });
    }

    const body = await request.json();
    const { title } = body;

    if (!title || title.trim() === "") {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const updatedImage = await updateImage(id, title.trim());

    return NextResponse.json({
      success: true,
      message: "Image updated successfully",
      image: updatedImage,
    });
  } catch (error) {
    console.error("Error updating image:", error);
    return NextResponse.json(
      { error: "Failed to update image" },
      { status: 500 }
    );
  }
}

// DELETE /api/images/[id] - Delete image
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initDatabase();

    const { id: idParam } = await params;
    const id = parseInt(idParam);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid image ID" }, { status: 400 });
    }

    // Get image record before deletion
    const imageRecord = await deleteImage(id);

    // Delete the physical file
    const filePath = path.join(process.cwd(), "public", imageRecord.image_path);
    try {
      await fs.unlink(filePath);
    } catch (fileError) {
      console.warn("Could not delete file:", imageRecord.image_path, fileError);
      // Continue even if file deletion fails
    }

    return NextResponse.json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting image:", error);
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    );
  }
}
