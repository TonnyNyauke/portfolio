import { NextResponse } from 'next/server';
import { readJsonFile, writeJsonFile } from '@/lib/fileStore';

type BookNote = { id: string; page: number; note: string; date: string; chapter?: string };
type Book = {
  id: string;
  title: string;
  author: string;
  genre: 'Business' | 'Tech' | 'Christian' | 'Others';
  currentPage: number;
  totalPages: number;
  startDate: string;
  status: 'currently-reading' | 'finished' | 'want-to-read';
  coverColor?: string;
  rating?: number;
  thoughts?: string;
  review?: string;
  notes: BookNote[];
};

type ReadingData = { books: Book[] };
const FILE = 'reading.json';

// GET single book
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await readJsonFile<ReadingData>(FILE, { books: [] });
    const book = data.books.find(b => b.id === id);
    
    if (!book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }
    
    return NextResponse.json({ book });
  } catch (e: any) {
    console.error('GET error:', e);
    return NextResponse.json({ error: e?.message || 'Failed to fetch book' }, { status: 500 });
  }
}

// PATCH (update) book
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updates = (await request.json()) as Partial<Book>;
    const data = await readJsonFile<ReadingData>(FILE, { books: [] });
    const index = data.books.findIndex(b => b.id === id);
    
    if (index === -1) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }
    
    // Merge updates, preserving notes unless explicitly updated
    data.books[index] = {
      ...data.books[index],
      ...updates,
      id, // Prevent ID changes
      notes: updates.notes !== undefined ? updates.notes : data.books[index].notes,
    };
    
    await writeJsonFile(FILE, data);
    return NextResponse.json({ book: data.books[index] });
  } catch (e: any) {
    console.error('PATCH error:', e);
    return NextResponse.json({ error: e?.message || 'Failed to update book' }, { status: 500 });
  }
}

// DELETE book
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await readJsonFile<ReadingData>(FILE, { books: [] });
    const filtered = data.books.filter(b => b.id !== id);
    
    if (filtered.length === data.books.length) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }
    
    await writeJsonFile(FILE, { books: filtered });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error('DELETE error:', e);
    return NextResponse.json({ error: e?.message || 'Failed to delete book' }, { status: 500 });
  }
}