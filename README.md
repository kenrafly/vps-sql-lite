# Image Upload & Gallery App (SQLite Version)

A modern, full-stack Next.js application for uploading and viewing images with a clean, responsive gallery interface.

## Features

- 📸 **Image Upload**: Upload images with custom titles
- 🖼️ **Gallery View**: Browse all uploaded images in a responsive grid
- 💾 **SQLite Database**: Lightweight, file-based database (no setup required)
- 📱 **Responsive Design**: Works perfectly on mobile, tablet, and desktop
- ⚡ **Real-time Updates**: Gallery automatically refreshes after uploads
- 🎨 **Modern UI**: Beautiful interface built with Tailwind CSS

## Quick Start

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Start the development server:**

   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Visit [http://localhost:3000](http://localhost:3000)

4. **Upload your first image:**
   - Enter a title
   - Select an image file (JPG, PNG, GIF, etc.)
   - Click "Upload Image"
   - See it appear in the gallery instantly!

## Tech Stack

- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** SQLite with better-sqlite3
- **File Storage:** Local filesystem (`public/uploads/`)

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/               # API endpoints
│   │   ├── upload/        # Image upload
│   │   └── images/        # Fetch images
│   ├── gallery/           # Gallery page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ImageGallery.tsx   # Gallery component
│   ├── ImageManager.tsx   # Upload + Gallery coordinator
│   ├── Navigation.tsx     # Header navigation
│   └── UploadForm.tsx     # Upload form
├── lib/
│   └── db.ts             # SQLite database utilities
├── public/uploads/       # Uploaded images storage
└── database.sqlite       # SQLite database file (auto-created)
```

## How It Works

1. **Upload Process:**

   - User selects image and enters title
   - File is validated (type, size) on both client and server
   - Image is saved to `public/uploads/` with unique filename
   - Metadata (title, path, timestamp) stored in SQLite database
   - Success response triggers gallery refresh

2. **Gallery Display:**

   - Fetches all image metadata from database via API
   - Displays images in responsive CSS Grid
   - Shows titles and upload timestamps
   - Supports manual refresh and auto-updates

3. **Database Schema:**
   ```sql
   CREATE TABLE images (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     title TEXT NOT NULL,
     image_path TEXT NOT NULL,
     created_at DATETIME DEFAULT CURRENT_TIMESTAMP
   );
   ```

## Features in Detail

### File Upload

- **Validation:** File type and size validation (max 10MB)
- **Security:** Unique filename generation to prevent conflicts
- **Storage:** Local filesystem with organized structure
- **Feedback:** Real-time upload progress and success/error messages

### Image Gallery

- **Responsive:** CSS Grid layout adapts to screen size
- **Performance:** Optimized images with Next.js Image component
- **UX:** Loading states, error handling, and empty states
- **Navigation:** Dedicated gallery page + integrated view

### Database

- **SQLite:** File-based database requiring no setup
- **Automatic:** Table creation and database initialization
- **Efficient:** Prepared statements and proper connection handling
- **Portable:** Single file database easy to backup/move

## Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Check code quality
npm run lint
```

## Deployment

The app is ready for deployment to platforms like:

- **Vercel** (recommended for Next.js)
- **Railway**
- **Netlify**
- **Any Node.js hosting**

For production, consider:

- Using cloud storage (AWS S3, Cloudinary) instead of local files
- Upgrading to PostgreSQL or MySQL for scalability
- Adding user authentication and authorization
- Implementing image optimization and resizing

## File Structure

All uploaded images are stored in `public/uploads/` and are publicly accessible. The SQLite database (`database.sqlite`) contains metadata only.

## License

This project is open source and available under the MIT License.

---

**Ready to upload your first image? Start the dev server and visit localhost:3000!** 🚀
