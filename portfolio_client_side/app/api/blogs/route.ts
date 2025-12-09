import { NextResponse } from 'next/server'
import { getAllBlogs, createBlog } from '@/lib/db/blogs'
import type { Blog } from '@/app/api/admin/blogs/route'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    const category = searchParams.get('category')
    const exclude = searchParams.get('exclude')
    const limit = Number.parseInt(searchParams.get('limit') ?? '', 10)

    const blogs = await getAllBlogs({
      category: category || undefined,
      exclude: exclude || undefined,
      limit: Number.isNaN(limit) ? undefined : limit,
    })

    return NextResponse.json({ blogs })
  } catch (error: any) {
    console.error('Error fetching blogs:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch blogs' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<Blog>
    if (!body.title) {
      return NextResponse.json({ error: 'title is required' }, { status: 400 })
    }

    const blog = await createBlog(body)
    return NextResponse.json({ blog })
  } catch (e: any) {
    console.error('Error creating blog:', e)
    return NextResponse.json({ 
      error: e?.message || 'Failed to create blog',
      details: process.env.NODE_ENV === 'development' ? e?.stack : undefined
    }, { status: 500 })
  }
}

