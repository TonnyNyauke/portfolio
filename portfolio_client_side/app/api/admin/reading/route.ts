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
  thoughts?: string; // short personal thoughts
  review?: string; // longer review/summary
  notes: BookNote[];
};

const FILE = '/reading.json';

type ReadingData = { books: Book[] };

export async function GET() {
  const data = await readJsonFile<ReadingData>(FILE, { books: [] });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<Book>;
    if (!body.title || !body.author) {
      return NextResponse.json({ error: 'title and author are required' }, { status: 400 });
    }
    const data = await readJsonFile<ReadingData>(FILE, { books: [] });
    const id = body.id || `${Date.now()}`;
    const book: Book = {
      id,
      title: body.title,
      author: body.author,
      genre: (body.genre as any) || 'Others',
      currentPage: Number(body.currentPage || 0),
      totalPages: Number(body.totalPages || 0),
      startDate: body.startDate || new Date().toISOString().slice(0, 10),
      status: (body.status as any) || 'currently-reading',
      coverColor: body.coverColor || 'from-blue-400 to-indigo-500',
      rating: body.rating,
      thoughts: body.thoughts || '',
      review: body.review || '',
      notes: Array.isArray(body.notes) ? (body.notes as BookNote[]) : [],
    };
    data.books.push(book);
    await writeJsonFile(FILE, data);
    return NextResponse.json({ book });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed to create' }, { status: 500 });
  }
}


