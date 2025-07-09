# Next.js Image Upload App

A full-stack Next.js application that allows users to upload images with titles, stores them locally, and saves metadata to a PostgreSQL database.

## Features

- ✅ Upload images with titles via a web form
- ✅ Save images to local filesystem (`public/uploads`)
- ✅ Store image metadata in PostgreSQL database
- ✅ Real-time upload feedback and validation
- ✅ Image preview after successful upload
- ✅ File size validation (max 10MB)
- ✅ Image type validation
- ✅ Modern, responsive UI with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 15 with App Router, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with `pg` driver
- **File Upload**: Native Web API FormData (no external upload library needed)
- **Development**: TypeScript, ESLint

## Prerequisites

1. **Node.js** (v18 or higher)
2. **PostgreSQL** database server running locally or remotely

## Installation

1. Clone or download this project
2. Install dependencies:
   ```bash
   npm install
   ```

## Database Setup

1. Create a PostgreSQL database named `nextjs_upload` (or update the name in `.env.local`)
2. Update the database connection settings in `.env.local`:
   ```env
   POSTGRES_USER=postgres
   POSTGRES_HOST=localhost
   POSTGRES_DATABASE=nextjs_upload
   POSTGRES_PASSWORD=your_password
   POSTGRES_PORT=5432
   ```

The application will automatically create the required `images` table on first run.

## Running the Application

1. Start the development server:

   ```bash
   npm run dev
   ```

2. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/
│   ├── api/upload/
│   │   └── route.ts          # API endpoint for image upload
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Main page with upload form
├── components/
│   └── UploadForm.tsx        # Upload form component
├── lib/
│   └── db.ts                 # Database utilities and queries
├── public/
│   └── uploads/              # Uploaded images storage
└── .env.local                # Environment variables
```

## API Endpoints

### POST /api/upload

Upload an image with title.

**Request:**

- Method: POST
- Content-Type: multipart/form-data
- Body:
  - `title` (string): Image title
  - `image` (file): Image file (max 10MB)

**Response:**

```json
{
  "success": true,
  "message": "Image uploaded successfully!",
  "image": {
    "id": 1,
    "title": "My Image",
    "image_path": "/uploads/1641234567890-abc123.jpg",
    "created_at": "2024-01-01T12:00:00.000Z"
  }
}
```

## Database Schema

### Images Table

```sql
CREATE TABLE images (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  image_path VARCHAR(500) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Development

- The app uses Next.js App Router with TypeScript
- File uploads are handled using the native Web API FormData
- Images are stored in `public/uploads/` with unique filenames
- Database connection uses connection pooling with `pg`
- All form validation happens both client-side and server-side

## Production Considerations

- Set up proper error logging
- Configure file storage (AWS S3, Cloudinary, etc.) instead of local filesystem
- Add user authentication and authorization
- Implement image optimization and resizing
- Add pagination for image gallery
- Set up proper environment variables for production
- Configure database connection pooling limits
- Add rate limiting for upload endpoint
