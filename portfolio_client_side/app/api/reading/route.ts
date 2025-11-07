import { NextResponse } from 'next/server'
import { readJsonFile } from '@/lib/fileStore'

type BookNote = { id: string; page: number; note: string; date: string; chapter?: string }
type Book = {
  id: string
  title: string
  author: string
  genre: 'Business' | 'Tech' | 'Christian' | 'Others'
  currentPage: number
  totalPages: number
  startDate: string
  status: 'currently-reading' | 'finished' | 'want-to-read'
  coverColor?: string
  rating?: number
  thoughts?: string
  review?: string
  notes: BookNote[]
}

type ReadingData = { books: Book[] }

const FILE = '/reading.json'

export async function GET() {
  const data = await readJsonFile<ReadingData>(FILE, { books: [] })
  return NextResponse.json(data)
}

