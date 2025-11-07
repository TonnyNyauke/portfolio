// app/api/adventures/[id]/route.ts
import { NextResponse } from 'next/server'
import { readJsonFile } from '@/lib/fileStore'

type Adventure = {
  id: string
  title: string
  subtitle: string
  description: string
  content: string
  date: string
  type: 'Experience' | 'Community' | 'Travel'
  color: string
  icon: string
  images: string[]
  location?: string
  status?: 'ongoing' | 'completed'
}

type Blog = {
  id: string
  title: string
  date: string
}

type RelatedItem = {
  id: string
  title: string
  type: 'adventure' | 'blog'
  date: string
}

const ADVENTURES_FILE = 'adventures.json'
const BLOGS_FILE = 'blogs.json'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    console.log('[API Route] Request URL:', request.url)
    console.log('[API Route] Fetching adventure with ID:', id)
    console.log('[API Route] ID type:', typeof id)
    console.log('[API Route] ID length:', id?.length)

    if (!id) {
      console.error('[API Route] No ID provided')
      return NextResponse.json(
        { success: false, error: 'Adventure ID is required' },
        { status: 400 }
      )
    }

    // Read adventures
    const adventures = await readJsonFile<Adventure[]>(ADVENTURES_FILE, [])
    console.log('[API Route] Total adventures found:', adventures.length)
    console.log('[API Route] Available IDs:', adventures.map(a => a.id))
    
    const adventure = adventures.find(a => a.id === id)

    if (!adventure) {
      console.log('[API Route] Adventure not found for ID:', id)
      console.log('[API Route] Tried matching against:', adventures.map(a => a.id))
      return NextResponse.json(
        { success: false, error: 'Adventure not found' },
        { status: 404 }
      )
    }

    console.log('[API Route] Adventure found:', adventure.title)

    // Get related adventures (same type, excluding current)
    const relatedAdventures = adventures
      .filter(a => a.id !== id && a.type === adventure.type)
      .slice(0, 2)
      .map(a => ({
        id: a.id,
        title: a.title,
        type: 'adventure' as const,
        date: a.date
      }))

    // Try to get related blogs (optional)
    let relatedBlogs: RelatedItem[] = []
    try {
      const blogs = await readJsonFile<Blog[]>(BLOGS_FILE, [])
      relatedBlogs = blogs
        .slice(0, 2)
        .map(b => ({
          id: b.id,
          title: b.title,
          type: 'blog' as const,
          date: b.date
        }))
    } catch (error) {
      console.log('[API Route] No blogs found for related content')
    }

    const related = [...relatedAdventures, ...relatedBlogs].slice(0, 4)

    console.log('[API Route] Returning success response')
    return NextResponse.json({
      success: true,
      adventure,
      related
    })
  } catch (e: any) {
    console.error('[API Route] Error reading adventure:', e)
    console.error('[API Route] Error stack:', e.stack)
    return NextResponse.json(
      { success: false, error: e?.message || 'Failed to load adventure' },
      { status: 500 }
    )
  }
}