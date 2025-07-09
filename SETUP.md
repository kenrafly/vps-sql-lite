# Quick Setup Guide

## 1. Database Setup (Required)

First, make sure PostgreSQL is installed and running on your system.

### Option A: Local PostgreSQL Installation

1. Install PostgreSQL from https://www.postgresql.org/download/
2. Create a database:
   ```sql
   CREATE DATABASE nextjs_upload;
   ```

### Option B: Using Docker (Recommended for Development)

```bash
docker run --name postgres-upload -e POSTGRES_PASSWORD=password -e POSTGRES_DB=nextjs_upload -p 5432:5432 -d postgres:latest
```

## 2. Environment Configuration

Update `.env.local` with your database credentials:

```env
POSTGRES_USER=postgres
POSTGRES_HOST=localhost
POSTGRES_DATABASE=nextjs_upload
POSTGRES_PASSWORD=password
POSTGRES_PORT=5432
```

## 3. Test Database Connection

```bash
npm run test-db
```

If successful, you should see:

```
✅ Database connected successfully!
✅ Database table "images" created/verified
✅ Current images count: 0
✅ Database test completed successfully!
```

## 4. Run the Application

```bash
npm run dev
```

Open http://localhost:3000 and test the upload functionality!

## Troubleshooting

### Database Connection Issues

- Make sure PostgreSQL is running
- Verify database credentials in `.env.local`
- Check if the database `nextjs_upload` exists
- Ensure PostgreSQL is accepting connections on port 5432

### File Upload Issues

- Check that `public/uploads/` directory exists (created automatically)
- Verify file permissions for the uploads directory
- Make sure uploaded images are under 10MB
- Only image files are accepted (jpg, png, gif, etc.)

### Build Issues

- Run `npm install` to ensure all dependencies are installed
- Check TypeScript errors with `npm run lint`
