# Supabase Setup Guide

## 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - Project name
   - Database password (save this!)
   - Region (choose closest to you)
5. Wait for project to be created (~2 minutes)

## 2. Set Up Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `supabase/schema.sql`
3. Paste and run it in the SQL Editor
4. This creates the `blogs`, `adventures`, and `books` tables

## 3. Get Your API Keys

1. Go to **Settings** → **API**
2. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 4. Configure Environment Variables

1. Create `.env.local` file in your project root:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   ```

2. For production (Vercel/Netlify):
   - Add these as environment variables in your deployment platform
   - They should be the same values

## 5. Migrate Existing Data (Optional)

If you have existing JSON data:

```bash
npx tsx scripts/migrate-to-supabase.ts
```

This will migrate all your blogs, adventures, and books from JSON files to Supabase.

## 6. Test the Setup

1. Start your dev server: `npm run dev`
2. Try creating a blog in the admin panel
3. Check your Supabase dashboard → **Table Editor** to see the data

## Row Level Security (RLS)

The schema sets up RLS policies:
- **Public reads**: Anyone can read blogs, adventures, and books
- **Writes**: Currently handled server-side (your API routes)

For production, you may want to:
- Add authentication
- Restrict writes to authenticated users
- Use service role key for admin operations

## Troubleshooting

### "Missing Supabase environment variables"
- Make sure `.env.local` exists with the correct variables
- Restart your dev server after adding env vars

### "Failed to fetch blogs"
- Check your Supabase URL and key are correct
- Verify the tables were created (check SQL Editor)
- Check browser console for detailed errors

### Migration script fails
- Ensure Supabase is set up and schema is run
- Check environment variables are set
- Verify JSON files exist in `data/` directory

