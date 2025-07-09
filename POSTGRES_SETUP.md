# PostgreSQL Setup Instructions for Windows

## Option 1: Install PostgreSQL (Recommended for production)

1. **Download PostgreSQL:**

   - Go to https://www.postgresql.org/download/windows/
   - Download the installer for Windows
   - Run the installer and follow the setup wizard

2. **During installation:**

   - Set a password for the `postgres` user (remember this!)
   - Use default port 5432
   - Keep default locale settings

3. **After installation:**

   - PostgreSQL should start automatically as a Windows service
   - Update your `.env.local` file with the correct password

4. **Create the database:**
   Open Command Prompt or PowerShell as Administrator and run:

   ```bash
   # Connect to PostgreSQL (replace 'your_password' with your actual password)
   psql -U postgres -h localhost

   # Create the database
   CREATE DATABASE nextjs_upload;

   # Exit
   \q
   ```

## Option 2: Use SQLite for Development (Quick Alternative)

If you want to test the app quickly without installing PostgreSQL, I can modify the code to use SQLite instead, which requires no setup.

## Option 3: Use Online PostgreSQL (Free Tier)

- **Supabase**: https://supabase.com (free tier available)
- **Railway**: https://railway.app (free tier available)
- **Neon**: https://neon.tech (free tier available)

These provide hosted PostgreSQL databases with connection strings you can use directly.

---

**Choose one option and let me know which you prefer!**
