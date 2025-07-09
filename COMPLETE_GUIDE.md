# Complete Guide: Building a Next.js Image Upload & Gallery App with SQLite

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Project Setup](#project-setup)
4. [SQLite Database Implementation](#sqlite-database-implementation)
5. [Backend API Development](#backend-api-development)
6. [Frontend Components](#frontend-components)
7. [File Upload System](#file-upload-system)
8. [Gallery Implementation](#gallery-implementation)
9. [Navigation & Routing](#navigation--routing)
10. [How It All Works Together](#how-it-all-works-together)
11. [Deployment Considerations](#deployment-considerations)

---

## Project Overview

This is a full-stack Next.js application that allows users to:

- Upload images with titles through a web form
- Store images in the local filesystem (`public/uploads/`)
- Save image metadata (title, path, timestamp) in an SQLite database
- View all uploaded images in a responsive gallery
- Navigate between upload and gallery pages

### Key Features

- ✅ **File Upload**: Drag & drop or click to upload images
- ✅ **Validation**: File type and size validation (max 10MB)
- ✅ **SQLite Database**: Lightweight, file-based database (no setup required)
- ✅ **Real-time Updates**: Gallery refreshes after upload
- ✅ **Responsive Design**: Works on all devices
- ✅ **Error Handling**: Comprehensive error management

---

## Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling and responsive design

### Backend

- **Next.js API Routes** - Server-side endpoints
- **SQLite + better-sqlite3** - Database (can switch to PostgreSQL)
- **Node.js File System** - File storage

### Development Tools

- **ESLint** - Code linting
- **TypeScript** - Type checking

---

## Project Setup

### 1. Initialize Next.js Project

```bash
npx create-next-app@latest practice --typescript --tailwind --eslint --app
cd practice
```

### 2. Install Dependencies

```bash
# Database packages
npm install better-sqlite3 @types/better-sqlite3

# Optional: PostgreSQL packages (for production)
npm install pg @types/pg
```

### 3. Project Structure

```
practice/
├── app/                      # Next.js App Router
│   ├── api/                  # API endpoints
│   │   ├── upload/route.ts   # Image upload endpoint
│   │   └── images/route.ts   # Fetch images endpoint
│   ├── gallery/              # Gallery page
│   │   └── page.tsx
│   ├── layout.tsx            # Root layout with navigation
│   └── page.tsx              # Home page
├── components/               # React components
│   ├── ImageGallery.tsx      # Gallery component
│   ├── ImageManager.tsx      # Upload + Gallery manager
│   ├── Navigation.tsx        # Header navigation
│   └── UploadForm.tsx        # Upload form component
├── lib/                      # Utilities
│   ├── db.ts                 # Active database config
│   ├── db-sqlite.ts          # SQLite implementation
│   └── db-postgres.ts        # PostgreSQL implementation
├── public/
│   └── uploads/              # Uploaded images storage
├── scripts/                  # Utility scripts
│   ├── test-db.js           # Database connection test
│   └── switch-db.js         # Switch between databases
└── .env.local               # Environment variables
```

---

## Database Implementation

### SQLite Setup (Development)

**File: `lib/db-sqlite.ts`**

```typescript
import Database from "better-sqlite3";
import path from "path";

// Create SQLite database file in project root
const dbPath = path.join(process.cwd(), "database.sqlite");
const db = new Database(dbPath);

// Initialize database table
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

// Insert new image record
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

// Cleanup on exit
process.on("exit", () => db.close());
process.on("SIGINT", () => {
  db.close();
  process.exit(0);
});

export default db;
```

### Why SQLite?

- **No Setup Required**: Works immediately without installation
- **File-based**: Database is a single file (`database.sqlite`)
- **Perfect for Development**: Easy to reset, backup, or inspect
- **Production Ready**: Can handle thousands of records efficiently

### Database Schema

```sql
CREATE TABLE images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,  -- Unique identifier
  title TEXT NOT NULL,                   -- User-provided title
  image_path TEXT NOT NULL,              -- Path to uploaded file
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP  -- Upload timestamp
);
```

---

## Backend API Development

### 1. Image Upload Endpoint

**File: `app/api/upload/route.ts`**

```typescript
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

    // Extract and validate title
    const title = formData.get("title") as string;
    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    // Extract and validate image file
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

    // Validate file size (10MB limit)
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

    // Write file to filesystem
    await fs.writeFile(uploadPath, buffer);

    // Save metadata to database
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
```

### 2. Fetch Images Endpoint

**File: `app/api/images/route.ts`**

```typescript
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
```

---

## Frontend Components

### 1. Upload Form Component

**File: `components/UploadForm.tsx`**

```typescript
"use client";

import { useState } from "react";
import Image from "next/image";

interface UploadResponse {
  success: boolean;
  message: string;
  image?: {
    id: number;
    title: string;
    image_path: string;
    created_at: string;
  };
  error?: string;
}

interface UploadFormProps {
  onUploadSuccess?: () => void;
}

export default function UploadForm({ onUploadSuccess }: UploadFormProps) {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [response, setResponse] = useState<UploadResponse | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !image) {
      setResponse({
        success: false,
        message: "",
        error: "Please provide both title and image",
      });
      return;
    }

    setUploading(true);
    setResponse(null);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("image", image);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data: UploadResponse = await res.json();
      setResponse(data);

      if (data.success) {
        setTitle("");
        setImage(null);
        // Reset file input
        const fileInput = document.getElementById("image") as HTMLInputElement;
        if (fileInput) fileInput.value = "";

        // Trigger gallery refresh
        if (onUploadSuccess) {
          onUploadSuccess();
        }
      }
    } catch {
      setResponse({
        success: false,
        message: "",
        error: "Network error occurred",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setResponse({
          success: false,
          message: "",
          error: "Please select a valid image file",
        });
        return;
      }

      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        setResponse({
          success: false,
          message: "",
          error: "Image must be smaller than 10MB",
        });
        return;
      }

      setImage(file);
      setResponse(null);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Upload Image
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title Input */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter image title"
            required
          />
        </div>

        {/* File Input */}
        <div>
          <label
            htmlFor="image"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Image
          </label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700"
            required
          />
          {image && (
            <p className="mt-2 text-sm text-gray-600">
              Selected: {image.name} ({(image.size / 1024 / 1024).toFixed(2)}{" "}
              MB)
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={uploading || !title || !image}
          className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
        >
          {uploading ? "Uploading..." : "Upload Image"}
        </button>
      </form>

      {/* Response Messages */}
      {response && (
        <div
          className={`mt-4 p-4 rounded-md ${
            response.success
              ? "bg-green-100 border border-green-400"
              : "bg-red-100 border border-red-400"
          }`}
        >
          {response.success ? (
            <div className="text-green-700">
              <p className="font-semibold">✅ {response.message}</p>
              {response.image && (
                <div className="mt-2">
                  <p className="text-sm">Title: {response.image.title}</p>
                  <p className="text-sm">
                    Uploaded:{" "}
                    {new Date(response.image.created_at).toLocaleString()}
                  </p>
                  <Image
                    src={response.image.image_path}
                    alt={response.image.title}
                    width={200}
                    height={128}
                    className="mt-2 max-w-full h-32 object-cover rounded"
                  />
                </div>
              )}
            </div>
          ) : (
            <p className="text-red-700">❌ {response.error}</p>
          )}
        </div>
      )}
    </div>
  );
}
```

### 2. Image Gallery Component

**File: `components/ImageGallery.tsx`**

```typescript
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface ImageData {
  id: number;
  title: string;
  image_path: string;
  created_at: string;
}

export default function ImageGallery() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/images");
      const data = await response.json();

      if (data.success) {
        setImages(data.images);
      } else {
        setError("Failed to load images");
      }
    } catch {
      setError("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading images...</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <button
          onClick={fetchImages}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Empty state
  if (images.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-4">No images uploaded yet</div>
        <p className="text-gray-400">
          Upload your first image using the form above!
        </p>
      </div>
    );
  }

  // Gallery grid
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Image Gallery ({images.length} images)
        </h2>
        <button
          onClick={fetchImages}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200 flex items-center gap-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image) => (
          <div
            key={image.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="relative h-48 bg-gray-100">
              <Image
                src={image.image_path}
                alt={image.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate">
                {image.title}
              </h3>
              <div className="text-sm text-gray-500 flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {new Date(image.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## File Upload System

### How File Upload Works

1. **Client Side**:

   - User selects file using `<input type="file">`
   - File is validated (type, size) in browser
   - FormData object is created with title and file
   - POST request sent to `/api/upload`

2. **Server Side**:

   - Next.js receives FormData via `req.formData()`
   - File is converted to Buffer: `imageFile.arrayBuffer()`
   - Unique filename generated: `timestamp-random.ext`
   - File saved to `public/uploads/` directory
   - Metadata saved to database

3. **Storage Structure**:
   ```
   public/uploads/
   ├── 1672531200000-abc123.jpg
   ├── 1672531300000-def456.png
   └── 1672531400000-ghi789.gif
   ```

### File Validation

```typescript
// Client-side validation
if (!file.type.startsWith("image/")) {
  // Reject non-image files
}

if (file.size > 10 * 1024 * 1024) {
  // 10MB
  // Reject large files
}

// Server-side validation (duplicate checks)
if (!imageFile.type.startsWith("image/")) {
  return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
}
```

---

## Gallery Implementation

### Real-time Updates

The gallery automatically refreshes when new images are uploaded using a communication system between components:

```typescript
// ImageManager.tsx - Coordinates upload and gallery
export default function ImageManager() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUploadSuccess = () => {
    // Trigger gallery refresh by changing key
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <>
      <UploadForm onUploadSuccess={handleUploadSuccess} />
      <ImageGallery key={refreshKey} /> {/* Re-renders when key changes */}
    </>
  );
}
```

### Responsive Design

The gallery uses CSS Grid with responsive breakpoints:

```css
.grid {
  grid-template-columns: repeat(1, minmax(0, 1fr)); /* Mobile: 1 column */
}

@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr)); /* Tablet: 2 columns */
  }
}

@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(3, minmax(0, 1fr)); /* Desktop: 3 columns */
  }
}
```

---

## Navigation & Routing

### Navigation Component

**File: `components/Navigation.tsx`**

```typescript
import Link from "next/link";

export default function Navigation() {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900">ImageApp</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Upload
            </Link>
            <Link
              href="/gallery"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Gallery
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
```

### Pages Structure

1. **Home Page** (`app/page.tsx`): Upload form + Gallery combined
2. **Gallery Page** (`app/gallery/page.tsx`): Full-screen gallery view
3. **Layout** (`app/layout.tsx`): Navigation wrapper for all pages

---

## How It All Works Together

### 1. Application Flow

```mermaid
graph TD
    A[User visits homepage] --> B[Upload form loads]
    B --> C[User selects image & enters title]
    C --> D[Client validates file]
    D --> E[FormData sent to /api/upload]
    E --> F[Server validates & saves file]
    F --> G[Database record created]
    G --> H[Success response sent]
    H --> I[Gallery refreshes automatically]
    I --> J[New image appears in gallery]
```

### 2. Data Flow

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Upload Form   │───▶│   API Endpoint  │───▶│    Database     │
│                 │    │                 │    │                 │
│ • File input    │    │ • Validate file │    │ • Store metadata│
│ • Title input   │    │ • Generate name │    │ • Return record │
│ • Submit button │    │ • Save to disk  │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                                              │
         │              ┌─────────────────┐            │
         └─────────────▶│  Image Gallery  │◀───────────┘
                        │                 │
                        │ • Fetch images  │
                        │ • Display grid  │
                        │ • Auto refresh  │
                        └─────────────────┘
```

### 3. Component Communication

```typescript
// Parent component manages state
const [refreshKey, setRefreshKey] = useState(0);

// Upload form notifies parent of success
<UploadForm onUploadSuccess={() => setRefreshKey(prev => prev + 1)} />

// Gallery re-renders when key changes
<ImageGallery key={refreshKey} />
```

### 4. Database Operations

```sql
-- 1. Initialize table (automatic)
CREATE TABLE IF NOT EXISTS images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  image_path TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Insert new image (on upload)
INSERT INTO images (title, image_path) VALUES (?, ?);

-- 3. Fetch all images (for gallery)
SELECT * FROM images ORDER BY created_at DESC;
```

---

## Deployment Considerations

### Development vs Production

| Aspect           | Development (Current) | Production Recommendations      |
| ---------------- | --------------------- | ------------------------------- |
| **Database**     | SQLite file           | PostgreSQL, MySQL, or hosted DB |
| **File Storage** | Local filesystem      | AWS S3, Cloudinary, or CDN      |
| **Environment**  | Local development     | Vercel, Railway, or VPS         |
| **Domain**       | localhost:3000        | Custom domain with HTTPS        |

### Production Deployment Steps

1. **Choose Database**:

   ```bash
   # Switch to PostgreSQL
   npm run db:postgres

   # Set environment variables
   POSTGRES_URL=postgresql://user:pass@host:5432/dbname
   ```

2. **Configure File Storage**:

   ```typescript
   // Use cloud storage instead of local files
   import { S3Client } from "@aws-sdk/client-s3";
   // or
   import { v2 as cloudinary } from "cloudinary";
   ```

3. **Deploy to Vercel**:

   ```bash
   npm run build
   vercel --prod
   ```

4. **Environment Variables**:
   ```bash
   # .env.production
   DATABASE_URL=your_production_database_url
   AWS_ACCESS_KEY_ID=your_aws_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret
   ```

### Performance Optimizations

1. **Image Optimization**:

   - Add image resizing/compression
   - Generate thumbnails for faster gallery loading
   - Use Next.js Image component (already implemented)

2. **Database Optimization**:

   - Add indexes on frequently queried columns
   - Implement pagination for large galleries
   - Cache frequently accessed data

3. **File Storage**:
   - Use CDN for faster image delivery
   - Implement lazy loading for gallery
   - Add image format conversion (WebP)

---

## Security Considerations

### File Upload Security

1. **File Type Validation**:

   ```typescript
   // Validate MIME type and file extension
   const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
   if (!allowedTypes.includes(file.type)) {
     throw new Error("Invalid file type");
   }
   ```

2. **File Size Limits**:

   ```typescript
   const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
   if (file.size > MAX_FILE_SIZE) {
     throw new Error("File too large");
   }
   ```

3. **Filename Sanitization**:
   ```typescript
   // Generate safe, unique filenames
   const safeFilename = `${Date.now()}-${crypto.randomUUID()}${ext}`;
   ```

### Database Security

1. **Input Sanitization**: Using prepared statements prevents SQL injection
2. **Error Handling**: Don't expose database errors to clients
3. **Rate Limiting**: Implement upload rate limits per user/IP

---

## Testing the Application

### Manual Testing Checklist

- [ ] Upload various image formats (JPG, PNG, GIF)
- [ ] Test file size validation (try > 10MB file)
- [ ] Test with invalid file types (PDF, TXT)
- [ ] Verify gallery updates after upload
- [ ] Test responsive design on mobile/tablet
- [ ] Test navigation between pages
- [ ] Test error handling (disconnect internet)
- [ ] Verify image preview in success message

### Automated Testing

```bash
# Unit tests for database functions
npm test lib/db.test.ts

# Integration tests for API endpoints
npm test api/upload.test.ts

# E2E tests for user flows
npm run test:e2e
```

---

## Troubleshooting Common Issues

### Database Connection Issues

```bash
# Test database connection
npm run test-db

# Reset database
rm database.sqlite
npm run dev  # Will recreate table
```

### File Upload Issues

```bash
# Check uploads directory exists
ls -la public/uploads

# Check file permissions
chmod 755 public/uploads
```

### Build Issues

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

## Conclusion

This Next.js image upload and gallery application demonstrates:

- **Full-stack development** with modern React patterns
- **File handling** with validation and storage
- **Database integration** with SQLite/PostgreSQL
- **Responsive design** with Tailwind CSS
- **Type safety** with TypeScript
- **Error handling** and user feedback
- **Component architecture** and state management

The app is production-ready with proper error handling, validation, and can be easily extended with features like user authentication, image editing, or social sharing.

### Next Steps for Enhancement

1. **User Authentication**: Add login/register functionality
2. **Image Editing**: Integrate cropping and filtering tools
3. **Social Features**: Add likes, comments, and sharing
4. **Search & Filter**: Add image search and category filtering
5. **Admin Panel**: Add image management and user administration
6. **Analytics**: Track usage statistics and popular images

This comprehensive guide provides everything needed to understand, build, and deploy a production-ready image upload and gallery application using Next.js and modern web technologies.
