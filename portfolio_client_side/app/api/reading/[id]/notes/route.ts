import { NextResponse } from 'next/server'
import { addBookNote, deleteBookNote } from '@/lib/db/books'

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { page, note, date, chapter } = await request.json()
    
    if (typeof page !== 'number' || !note) {
      return NextResponse.json({ error: 'page (number) and note are required' }, { status: 400 })
    }
    
    const newNote = await addBookNote(id, { page, note, date, chapter })
    return NextResponse.json({ note: newNote })
  } catch (e: any) {
    console.error('Error adding note:', e)
    return NextResponse.json({ 
      error: e?.message || 'Failed to add note',
      details: process.env.NODE_ENV === 'development' ? e?.stack : undefined
    }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const url = new URL(request.url)
    const noteId = url.searchParams.get('noteId')
    
    if (!noteId) {
      return NextResponse.json({ error: 'noteId required' }, { status: 400 })
    }
    
    await deleteBookNote(id, noteId)
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    console.error('Error deleting note:', e)
    return NextResponse.json({ 
      error: e?.message || 'Failed to delete note',
      details: process.env.NODE_ENV === 'development' ? e?.stack : undefined
    }, { status: 500 })
  }
}

