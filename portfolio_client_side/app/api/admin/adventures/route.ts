// app/api/admin/adventures/route.ts
import { NextResponse } from 'next/server'
import { readJsonFile, writeJsonFile } from '@/lib/fileStore'

export type Adventure = {
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

const FILE = 'adventures.json'

// GET - Fetch all adventures
export async function GET() {
  const data = await readJsonFile<Adventure[]>(FILE, [])
  return NextResponse.json({ adventures: data })
}

// POST - Create new adventure
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<Adventure>
    
    // Validate required fields
    if (!body.title || !body.subtitle || !body.description || !body.content) {
      return NextResponse.json(
        { error: 'Missing required fields: title, subtitle, description, content' },
        { status: 400 }
      )
    }

    const adventures = await readJsonFile<Adventure[]>(FILE, [])
    const id = body.id || `${Date.now()}`

    // Check if adventure with same ID already exists
    if (adventures.find(a => a.id === id)) {
      return NextResponse.json(
        { error: 'Adventure with this ID already exists' },
        { status: 400 }
      )
    }

    const adventure: Adventure = {
      id,
      title: body.title!,
      subtitle: body.subtitle!,
      description: body.description!,
      content: body.content!,
      date: body.date || new Date().toISOString().split('T')[0],
      type: body.type || 'Experience',
      color: body.color || 'from-rose-500 to-pink-600',
      icon: body.icon || 'Heart',
      images: body.images || [],
      location: body.location,
      status: body.status || 'completed'
    }

    adventures.push(adventure)
    await writeJsonFile(FILE, adventures)

    return NextResponse.json({
      success: true,
      adventure,
      message: 'Adventure created successfully'
    })
  } catch (e: any) {
    console.error('Error creating adventure:', e)
    return NextResponse.json(
      { success: false, error: e?.message || 'Failed to create adventure' },
      { status: 500 }
    )
  }
}

// PUT - Update existing adventure
export async function PUT(request: Request) {
  try {
    const updates = (await request.json()) as Partial<Adventure>

    if (!updates.id) {
      return NextResponse.json(
        { error: 'Adventure ID is required' },
        { status: 400 }
      )
    }

    const adventures = await readJsonFile<Adventure[]>(FILE, [])
    const index = adventures.findIndex(a => a.id === updates.id)

    if (index === -1) {
      return NextResponse.json(
        { error: 'Adventure not found' },
        { status: 404 }
      )
    }

    const updated: Adventure = {
      ...adventures[index],
      ...updates,
      id: updates.id
    }

    adventures[index] = updated
    await writeJsonFile(FILE, adventures)

    return NextResponse.json({
      success: true,
      adventure: updated,
      message: 'Adventure updated successfully'
    })
  } catch (e: any) {
    console.error('Error updating adventure:', e)
    return NextResponse.json(
      { success: false, error: e?.message || 'Failed to update adventure' },
      { status: 500 }
    )
  }
}

// DELETE - Delete adventure
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()

    if (!id) {
      return NextResponse.json(
        { error: 'Adventure ID is required' },
        { status: 400 }
      )
    }

    const adventures = await readJsonFile<Adventure[]>(FILE, [])
    const next = adventures.filter(a => a.id !== id)

    await writeJsonFile(FILE, next)

    return NextResponse.json({
      success: true,
      ok: true,
      message: 'Adventure deleted successfully'
    })
  } catch (e: any) {
    console.error('Error deleting adventure:', e)
    return NextResponse.json(
      { success: false, error: e?.message || 'Failed to delete adventure' },
      { status: 500 }
    )
  }
}