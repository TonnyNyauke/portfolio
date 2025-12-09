import { NextResponse } from 'next/server'
import { getAdventureById, updateAdventure, deleteAdventure, getAllAdventures } from '@/lib/db/adventures'
import { getAllBlogs } from '@/lib/db/blogs'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Adventure ID is required' },
        { status: 400 }
      )
    }

    const adventure = await getAdventureById(id)

    if (!adventure) {
      return NextResponse.json(
        { success: false, error: 'Adventure not found' },
        { status: 404 }
      )
    }

    // Get related adventures (same type, excluding current)
    const allAdventures = await getAllAdventures()
    const relatedAdventures = allAdventures
      .filter(a => a.id !== id && a.type === adventure.type)
      .slice(0, 2)
      .map(a => ({
        id: a.id,
        title: a.title,
        type: 'adventure' as const,
        date: a.date
      }))

    // Get related blogs
    let relatedBlogs: Array<{
      id: string
      title: string
      type: 'blog'
      date: string
    }> = []

    try {
      const blogs = await getAllBlogs({ limit: 2 })
      relatedBlogs = blogs.map(b => ({
        id: b.id,
        title: b.title,
        type: 'blog' as const,
        date: b.created_at
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
  } catch (error: any) {
    console.error('Error fetching adventure:', error)
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to load adventure' },
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
    
    const adventure = await updateAdventure(id, updates)
    return NextResponse.json({ 
      success: true,
      adventure,
      message: 'Adventure updated successfully'
    })
  } catch (e: any) {
    console.error('Error updating adventure:', e)
    return NextResponse.json({ 
      success: false,
      error: e?.message || 'Failed to update adventure',
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
      return NextResponse.json({ error: 'Adventure ID is required' }, { status: 400 })
    }
    
    await deleteAdventure(id)
    return NextResponse.json({ 
      success: true,
      ok: true,
      message: 'Adventure deleted successfully'
    })
  } catch (e: any) {
    console.error('Error deleting adventure:', e)
    return NextResponse.json({ 
      success: false,
      error: e?.message || 'Failed to delete adventure',
      details: process.env.NODE_ENV === 'development' ? e?.stack : undefined
    }, { status: 500 })
  }
}

