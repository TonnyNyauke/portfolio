# Data Persistence: JSON Files vs Databases

## The Key Difference

You're absolutely right to question this! Here's the crucial distinction:

### ✅ **Committed JSON Files (in Git) = PERSISTENT**
- Files in your `data/` directory that are **committed to git**
- These ARE like a database - they're part of your codebase
- They get deployed with your app on every deployment
- They persist across deployments, restarts, and server changes
- **This is exactly like using Firebase/MongoDB, but version-controlled!**

### ❌ **Runtime-Written JSON Files = NOT PERSISTENT in Serverless**
- Files written **during runtime** (when your app is running)
- In serverless environments (Vercel, Netlify), the filesystem is **read-only**
- Even `/tmp` is ephemeral - gets wiped between function invocations
- These writes are lost when the serverless function ends

## How Serverless Works

```
┌─────────────────────────────────────┐
│  Your Code (Git Repo)              │
│  ├── app/                          │
│  ├── data/                         │ ← ✅ Committed files = Persistent
│  │   ├── blogs.json               │
│  │   └── adventures.json           │
│  └── lib/                          │
└─────────────────────────────────────┘
           │
           │ Deploy
           ▼
┌─────────────────────────────────────┐
│  Serverless Environment            │
│  ├── Read-only filesystem          │
│  │   └── data/ (from git) ✅       │ ← Can READ committed files
│  └── /tmp (ephemeral)              │ ← Can WRITE, but lost on restart
└─────────────────────────────────────┘
```

## The Solution: Commit Your JSON Files

### Option 1: Static Data (Recommended for Small Sites)
1. **Commit your JSON files to git** in the `data/` directory
2. **Read from committed files** - these are persistent!
3. **For updates**: Edit files locally, commit, and redeploy
   - Or use a database for runtime writes

### Option 2: Hybrid Approach
1. **Read** from committed JSON files (initial data)
2. **Write** to a database for runtime changes
3. Periodically sync database → JSON files → commit to git

### Option 3: Full Database (Best for Production)
- Use PostgreSQL, MongoDB, Supabase, etc.
- All reads and writes go to the database
- Most scalable and reliable solution

## Current Setup

Your `data/` directory exists and contains:
- `blogs.json`
- `adventures.json`
- `reading.json`
- etc.

**These files ARE persistent if committed to git!**

## Making It Work

1. **Ensure files are committed to git:**
   ```bash
   git add data/*.json
   git commit -m "Add data files"
   git push
   ```

2. **The code will:**
   - ✅ **READ** from `data/*.json` (works in production - files are deployed)
   - ❌ **WRITE** to `data/*.json` (fails in production - filesystem is read-only)

3. **For runtime writes, you need:**
   - A database (PostgreSQL, MongoDB, Supabase)
   - Or external storage (S3, Cloud Storage)
   - Or commit changes back to git via GitHub API (complex)

## Why This Happens

**Local Development:**
- Full filesystem access
- Can read AND write JSON files
- Changes persist locally

**Production (Serverless):**
- Read-only filesystem (except `/tmp`)
- Can READ committed files ✅
- Cannot WRITE to filesystem ❌
- `/tmp` is ephemeral (wiped on restart)

## Recommendation

For a portfolio site with infrequent updates:
1. **Use committed JSON files** for initial/static data
2. **For admin panel writes**, use a simple database:
   - **Supabase** (free tier, easy setup)
   - **Vercel Postgres** (if on Vercel)
   - **MongoDB Atlas** (free tier)

This gives you:
- ✅ Persistent data
- ✅ Runtime writes
- ✅ Easy to manage
- ✅ Scales if needed

