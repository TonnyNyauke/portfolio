//api/admin/reading/[id]/notes

import { NextResponse } from 'next/server';
import { readJsonFile, writeJsonFile } from '@/lib/fileStore';

type BookNote = { id: string; page: number; note: string; date: string; chapter?: string };
type Book = { id: string; notes: BookNote[] } & Record<string, any>;
type ReadingData = { books: Book[] };
const FILE = 'reading.json';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { page, note, date, chapter } = (await request.json()) as Partial<BookNote>;
    if (typeof page !== 'number' || !note) {
      return NextResponse.json({ error: 'page (number) and note are required' }, { status: 400 });
    }
    const data = await readJsonFile<ReadingData>(FILE, { books: [] });
    const index = data.books.findIndex(b => b.id === id);
    if (index === -1) return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    const newNote: BookNote = { id: `${Date.now()}`, page, note, date: date || new Date().toISOString().slice(0, 10), chapter };
    data.books[index].notes = data.books[index].notes || [];
    data.books[index].notes.push(newNote);
    await writeJsonFile(FILE, data);
    return NextResponse.json({ note: newNote });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed to add note' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const url = new URL(request.url);
    const noteId = url.searchParams.get('noteId');
    if (!noteId) return NextResponse.json({ error: 'noteId required' }, { status: 400 });
    const data = await readJsonFile<ReadingData>(FILE, { books: [] });
    const index = data.books.findIndex(b => b.id === id);
    if (index === -1) return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    data.books[index].notes = (data.books[index].notes || []).filter(n => n.id !== noteId);
    await writeJsonFile(FILE, data);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed to delete note' }, { status: 500 });
  }
}