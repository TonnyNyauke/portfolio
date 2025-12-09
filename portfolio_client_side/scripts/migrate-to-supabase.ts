/**
 * Migration script to move data from JSON files to Supabase
 * 
 * Usage:
 * 1. Set up your Supabase project and run the schema.sql
 * 2. Set environment variables (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)
 * 3. Run: npx tsx scripts/migrate-to-supabase.ts
 */

import { readJsonFile } from '../lib/fileStore'
import { createBlog } from '../lib/db/blogs'
import { createAdventure } from '../lib/db/adventures'
import { createBook } from '../lib/db/books'

async function migrate() {
  console.log('Starting migration to Supabase...\n')

  try {
    // Migrate blogs
    console.log('Migrating blogs...')
    const blogs = await readJsonFile<any[]>('blogs.json', [])
    for (const blog of blogs) {
      try {
        await createBlog(blog)
        console.log(`  ✓ Migrated blog: ${blog.title}`)
      } catch (error: any) {
        if (error.message?.includes('duplicate')) {
          console.log(`  ⊘ Skipped (already exists): ${blog.title}`)
        } else {
          console.error(`  ✗ Failed to migrate blog ${blog.title}:`, error.message)
        }
      }
    }

    // Migrate adventures
    console.log('\nMigrating adventures...')
    const adventures = await readJsonFile<any[]>('adventures.json', [])
    for (const adventure of adventures) {
      try {
        await createAdventure(adventure)
        console.log(`  ✓ Migrated adventure: ${adventure.title}`)
      } catch (error: any) {
        if (error.message?.includes('duplicate')) {
          console.log(`  ⊘ Skipped (already exists): ${adventure.title}`)
        } else {
          console.error(`  ✗ Failed to migrate adventure ${adventure.title}:`, error.message)
        }
      }
    }

    // Migrate books
    console.log('\nMigrating books...')
    const readingData = await readJsonFile<{ books: any[] }>('reading.json', { books: [] })
    for (const book of readingData.books) {
      try {
        await createBook(book)
        console.log(`  ✓ Migrated book: ${book.title}`)
      } catch (error: any) {
        if (error.message?.includes('duplicate')) {
          console.log(`  ⊘ Skipped (already exists): ${book.title}`)
        } else {
          console.error(`  ✗ Failed to migrate book ${book.title}:`, error.message)
        }
      }
    }

    console.log('\n✅ Migration completed!')
  } catch (error: any) {
    console.error('\n❌ Migration failed:', error.message)
    process.exit(1)
  }
}

migrate()

