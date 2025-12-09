import { NextResponse } from 'next/server'
import { getBookById, updateBook, deleteBook } from '@/lib/db/books'

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const book = await getBookById(id)
    
    if (!book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 })
    }
    
    return NextResponse.json({ book })
  } catch (e: any) {
    console.error('Error fetching book:', e)
    return NextResponse.json({ error: e?.message || 'Failed to fetch book' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const updates = await request.json()
    
    const book = await updateBook(id, updates)
    return NextResponse.json({ book })
  } catch (e: any) {
    console.error('Error updating book:', e)
    return NextResponse.json({ 
      error: e?.message || 'Failed to update book',
      details: process.env.NODE_ENV === 'development' ? e?.stack : undefined
    }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Alias for PUT to maintain backward compatibility
  return PUT(request, { params })
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await deleteBook(id)
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    console.error('Error deleting book:', e)
    return NextResponse.json({ 
      error: e?.message || 'Failed to delete book',
      details: process.env.NODE_ENV === 'development' ? e?.stack : undefined
    }, { status: 500 })
  }
}

