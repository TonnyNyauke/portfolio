import { NextResponse } from 'next/server'
import { getAllAdventures, createAdventure, updateAdventure, deleteAdventure } from '@/lib/db/adventures'
import type { Adventure } from '@/app/api/admin/adventures/route'

export async function GET() {
  try {
    const adventures = await getAllAdventures()
    return NextResponse.json({ adventures })
  } catch (error: any) {
    console.error('Error fetching adventures:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch adventures' },
      { status: 500 }
    )
  }
}

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

    const adventure = await createAdventure(body)

    return NextResponse.json({
      success: true,
      adventure,
      message: 'Adventure created successfully'
    })
  } catch (e: any) {
    console.error('Error creating adventure:', e)
    return NextResponse.json(
      { 
        success: false, 
        error: e?.message || 'Failed to create adventure',
        details: process.env.NODE_ENV === 'development' ? e?.stack : undefined
      },
      { status: 500 }
    )
  }
}


