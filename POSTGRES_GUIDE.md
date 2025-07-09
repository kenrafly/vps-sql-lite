# 🐘 PostgreSQL Image Upload App Setup

## Prerequisites

Before running this application, you need to have PostgreSQL installed and running on your system.

### Install PostgreSQL

**Windows:**

1. Download PostgreSQL from https://www.postgresql.org/download/windows/
2. Run the installer and follow the setup wizard
3. Remember the password you set for the `postgres` user
4. Default port is usually 5432

**macOS:**

```bash
# Using Homebrew
brew install postgresql
brew services start postgresql

# Or using Postgres.app
# Download from https://postgresapp.com/
```

**Linux (Ubuntu/Debian):**

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

## Database Setup

### 1. Create Database

Connect to PostgreSQL and create the database:

```bash
# Connect to PostgreSQL as postgres user
psql -U postgres

# Create the database
CREATE DATABASE image_gallery;

# Exit
\q
```

### 2. Configure Environment Variables

Update your `.env.local` file with your PostgreSQL credentials:

```bash
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password_here
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=image_gallery
```

### 3. Test Connection

Run the database test script:

```bash
npm run test-db
```

## Quick Start

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up PostgreSQL database:**

   ```bash
   npm run setup-db
   ```

3. **Start the application:**

   ```bash
   npm run dev
   ```

4. **Open your browser:**
   http://localhost:3000

## Features

✅ **PostgreSQL Database** - Robust, production-ready database  
✅ **File Upload** - Upload images with titles  
✅ **Image Gallery** - View all uploaded images  
✅ **Edit & Delete** - Modify or remove images  
✅ **Responsive Design** - Works on mobile and desktop  
✅ **Real-time Updates** - Gallery refreshes after changes

## Database Schema

```sql
CREATE TABLE images (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  image_path TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Troubleshooting

### Connection Issues

- ❌ **Connection refused**: PostgreSQL is not running
- ❌ **Authentication failed**: Check username/password in `.env.local`
- ❌ **Database does not exist**: Create the database first
- ❌ **Permission denied**: Check user permissions

### Common Solutions

1. **Start PostgreSQL service:**

   ```bash
   # Windows (if installed as service)
   net start postgresql-x64-15

   # macOS
   brew services start postgresql

   # Linux
   sudo systemctl start postgresql
   ```

2. **Reset PostgreSQL password:**

   ```bash
   sudo -u postgres psql
   ALTER USER postgres PASSWORD 'new_password';
   ```

3. **Check PostgreSQL status:**

   ```bash
   # Linux/macOS
   sudo systemctl status postgresql

   # Or check if port is open
   netstat -an | grep 5432
   ```

## Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Check code quality
npm run test-db      # Test database connection
npm run setup-db     # Setup database tables
```

Your PostgreSQL-powered image upload app is ready! 🚀
