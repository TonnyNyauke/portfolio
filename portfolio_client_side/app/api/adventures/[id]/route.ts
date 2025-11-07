import { NextResponse } from 'next/server'
import { readJsonFile } from '@/lib/fileStore'
import type { Adventure } from '@/app/api/admin/adventures/route'
import type { Blog } from '@/app/api/admin/blogs/route'

const ADVENTURES_FILE = 'adventures.json'
const BLOGS_FILE = 'blogs.json'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  if (!id) {
    return NextResponse.json(
      { success: false, error: 'Adventure ID is required' },
      { status: 400 }
    )
  }

  const adventures = await readJsonFile<Adventure[]>(ADVENTURES_FILE, [])
  const adventure = adventures.find(a => a.id === id)

  if (!adventure) {
    return NextResponse.json(
      { success: false, error: 'Adventure not found' },
      { status: 404 }
    )
  }

  const relatedAdventures = adventures
    .filter(a => a.id !== id && a.type === adventure.type)
    .slice(0, 2)
    .map(a => ({
      id: a.id,
      title: a.title,
      type: 'adventure' as const,
      date: a.date
    }))

  let relatedBlogs: Array<{
    id: string
    title: string
    type: 'blog'
    date: string
  }> = []

  try {
    const blogs = await readJsonFile<Blog[]>(BLOGS_FILE, [])
    relatedBlogs = blogs.slice(0, 2).map(b => ({
      id: b.id,
      title: b.title,
      type: 'blog' as const,
      date: b.date
    }))
  } catch (error) {
    console.warn('Unable to load blogs for related content:', error)
  }

  const related = [...relatedAdventures, ...relatedBlogs].slice(0, 4)

  return NextResponse.json({
    success: true,
    adventure,
    related
  })
}

