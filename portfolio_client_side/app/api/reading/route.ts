import { NextResponse } from 'next/server'
import { getAllBooks, createBook } from '@/lib/db/books'

export async function GET() {
  try {
    const books = await getAllBooks()
    return NextResponse.json({ books })
  } catch (error: any) {
    console.error('Error fetching books:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch books' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    if (!body.title || !body.author) {
      return NextResponse.json({ error: 'title and author are required' }, { status: 400 })
    }

    const book = await createBook(body)
    return NextResponse.json({ book })
  } catch (e: any) {
    console.error('Error creating book:', e)
    return NextResponse.json({ 
      error: e?.message || 'Failed to create book',
      details: process.env.NODE_ENV === 'development' ? e?.stack : undefined
    }, { status: 500 })
  }
}

