# 🖼️ Image Upload Gallery App

A full-stack Next.js application for uploading and managing images with PostgreSQL database.

## Features

- 📤 **Image Upload** - Upload images with custom titles
- 🖼️ **Image Gallery** - View all uploaded images in a responsive grid
- ✏️ **Edit Images** - Update image titles inline
- 🗑️ **Delete Images** - Remove images with confirmation
- 🐘 **PostgreSQL Database** - Robust database for metadata storage
- 📱 **Responsive Design** - Works perfectly on mobile and desktop
- ⚡ **Real-time Updates** - Gallery updates immediately after changes

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with pg driver
- **File Storage**: Local filesystem (public/uploads)

## Prerequisites

- Node.js 18+
- PostgreSQL 12+
- npm or yarn

## Quick Start

1. **Clone and install:**

   ```bash
   git clone <your-repo>
   cd practice
   npm install
   ```

2. **Setup PostgreSQL:**

   - Install PostgreSQL if not already installed
   - Create database: `CREATE DATABASE image_gallery;`
   - Update `.env.local` with your PostgreSQL credentials

3. **Test database connection:**

   ```bash
   npm run test-db
   ```

4. **Start the app:**

   ```bash
   npm run dev
   ```

5. **Open browser:**
   http://localhost:3000

## Environment Variables

Create a `.env.local` file:

```bash
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=image_gallery
```

## API Endpoints

- `POST /api/upload` - Upload new image
- `GET /api/images` - Get all images
- `GET /api/images/[id]` - Get single image
- `PUT /api/images/[id]` - Update image title
- `DELETE /api/images/[id]` - Delete image

## Project Structure

```
├── app/
│   ├── api/           # API routes
│   ├── gallery/       # Gallery page
│   └── page.tsx       # Home page
├── components/        # React components
├── lib/              # Database utilities
├── public/uploads/   # Uploaded images
└── scripts/          # Database scripts
```

## Database Schema

```sql
CREATE TABLE images (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  image_path TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Development

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run linter
npm run test-db      # Test database connection
```

## Deployment

1. Setup PostgreSQL database on your hosting provider
2. Update environment variables
3. Deploy using Vercel, Railway, or your preferred platform

For detailed PostgreSQL setup instructions, see [POSTGRES_GUIDE.md](POSTGRES_GUIDE.md).

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - feel free to use this project for learning and development!
