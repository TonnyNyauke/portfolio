import { supabase } from '@/lib/supabase'

export type BookNote = {
  id: string
  page: number
  note: string
  date: string
  chapter?: string
}

export type Book = {
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

// Convert database row to Book type
function dbToBook(row: any): Book {
  return {
    id: row.id,
    title: row.title,
    author: row.author,
    genre: row.genre,
    currentPage: row.current_page,
    totalPages: row.total_pages,
    startDate: row.start_date,
    status: row.status,
    coverColor: row.cover_color || undefined,
    rating: row.rating || undefined,
    thoughts: row.thoughts || undefined,
    review: row.review || undefined,
    notes: (row.notes || []) as BookNote[],
  }
}

// Convert Book type to database insert format
function bookToDb(book: Partial<Book>): any {
  return {
    id: book.id,
    title: book.title,
    author: book.author,
    genre: book.genre || 'Others',
    current_page: book.currentPage || 0,
    total_pages: book.totalPages || 0,
    start_date: book.startDate || new Date().toISOString().split('T')[0],
    status: book.status || 'currently-reading',
    cover_color: book.coverColor || null,
    rating: book.rating || null,
    thoughts: book.thoughts || null,
    review: book.review || null,
    notes: book.notes || [],
  }
}

export async function getAllBooks(): Promise<Book[]> {
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .order('start_date', { ascending: false })

  if (error) {
    console.error('Error fetching books:', error)
    throw new Error(`Failed to fetch books: ${error.message}`)
  }

  return (data || []).map(dbToBook)
}

export async function getBookById(id: string): Promise<Book | null> {
  const { data, error } = await supabase.from('books').select('*').eq('id', id).single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null
    }
    console.error('Error fetching book:', error)
    throw new Error(`Failed to fetch book: ${error.message}`)
  }

  return data ? dbToBook(data) : null
}

export async function createBook(book: Partial<Book>): Promise<Book> {
  const bookData = bookToDb({
    ...book,
    id: book.id || `${Date.now()}`,
  })

  const { data, error } = await supabase.from('books').insert(bookData).select().single()

  if (error) {
    console.error('Error creating book:', error)
    throw new Error(`Failed to create book: ${error.message}`)
  }

  return dbToBook(data)
}

export async function updateBook(id: string, updates: Partial<Book>): Promise<Book> {
  const updateData: any = {}
  
  if (updates.title !== undefined) updateData.title = updates.title
  if (updates.author !== undefined) updateData.author = updates.author
  if (updates.genre !== undefined) updateData.genre = updates.genre
  if (updates.currentPage !== undefined) updateData.current_page = updates.currentPage
  if (updates.totalPages !== undefined) updateData.total_pages = updates.totalPages
  if (updates.startDate !== undefined) updateData.start_date = updates.startDate
  if (updates.status !== undefined) updateData.status = updates.status
  if (updates.coverColor !== undefined) updateData.cover_color = updates.coverColor
  if (updates.rating !== undefined) updateData.rating = updates.rating
  if (updates.thoughts !== undefined) updateData.thoughts = updates.thoughts
  if (updates.review !== undefined) updateData.review = updates.review
  if (updates.notes !== undefined) updateData.notes = updates.notes

  const { data, error } = await supabase
    .from('books')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating book:', error)
    throw new Error(`Failed to update book: ${error.message}`)
  }

  if (!data) {
    throw new Error('Book not found')
  }

  return dbToBook(data)
}

export async function deleteBook(id: string): Promise<void> {
  const { error } = await supabase.from('books').delete().eq('id', id)

  if (error) {
    console.error('Error deleting book:', error)
    throw new Error(`Failed to delete book: ${error.message}`)
  }
}

export async function addBookNote(bookId: string, note: Partial<BookNote>): Promise<BookNote> {
  const book = await getBookById(bookId)
  if (!book) {
    throw new Error('Book not found')
  }

  const newNote: BookNote = {
    id: note.id || `${Date.now()}`,
    page: note.page!,
    note: note.note!,
    date: note.date || new Date().toISOString().slice(0, 10),
    chapter: note.chapter,
  }

  const updatedNotes = [...(book.notes || []), newNote]

  const { data, error } = await supabase
    .from('books')
    .update({ notes: updatedNotes })
    .eq('id', bookId)
    .select()
    .single()

  if (error) {
    console.error('Error adding note:', error)
    throw new Error(`Failed to add note: ${error.message}`)
  }

  return newNote
}

export async function deleteBookNote(bookId: string, noteId: string): Promise<void> {
  const book = await getBookById(bookId)
  if (!book) {
    throw new Error('Book not found')
  }

  const updatedNotes = (book.notes || []).filter(n => n.id !== noteId)

  const { error } = await supabase
    .from('books')
    .update({ notes: updatedNotes })
    .eq('id', bookId)

  if (error) {
    console.error('Error deleting note:', error)
    throw new Error(`Failed to delete note: ${error.message}`)
  }
}

