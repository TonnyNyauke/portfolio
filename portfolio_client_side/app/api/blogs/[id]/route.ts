import { NextResponse } from 'next/server'
import { getBlogById, updateBlog, deleteBlog } from '@/lib/db/blogs'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { error: 'Blog ID is required' },
        { status: 400 }
      )
    }

    const blog = await getBlogById(id)

    if (!blog) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json({ blog })
  } catch (error: any) {
    console.error('Error fetching blog:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch blog' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const updates = await request.json()
    
    const blog = await updateBlog(id, updates)
    return NextResponse.json({ blog })
  } catch (e: any) {
    console.error('Error updating blog:', e)
    return NextResponse.json({ 
      error: e?.message || 'Failed to update blog',
      details: process.env.NODE_ENV === 'development' ? e?.stack : undefined
    }, { status: 500 })
  }
}

export async function DELETE(
  _: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    if (!id) {
      return NextResponse.json({ error: 'Blog ID is required' }, { status: 400 })
    }
    
    await deleteBlog(id)
    return NextResponse.json({ ok: true, message: 'Blog deleted successfully' })
  } catch (e: any) {
    console.error('Error deleting blog:', e)
    return NextResponse.json({ 
      error: e?.message || 'Failed to delete blog',
      details: process.env.NODE_ENV === 'development' ? e?.stack : undefined
    }, { status: 500 })
  }
}

