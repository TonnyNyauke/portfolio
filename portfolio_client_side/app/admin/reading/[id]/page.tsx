'use client'

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Trash2, Save } from 'lucide-react';

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

const COVER_COLORS = [
  'from-green-400 to-blue-500',
  'from-purple-400 to-pink-500',
  'from-blue-400 to-indigo-500',
  'from-red-400 to-orange-500',
  'from-yellow-400 to-orange-500',
  'from-pink-400 to-rose-500',
  'from-teal-400 to-cyan-500',
  'from-indigo-400 to-purple-500',
];

export default function AdminReadingEdit() {
  const params = useParams();
  const router = useRouter();
  const bookId = params.id as string;
  
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [noteForm, setNoteForm] = useState({ page: '', note: '', chapter: '' });
  
  useEffect(() => {
    loadBook();
  }, [bookId]);

  async function loadBook() {
    setLoading(true);
    try {
      const res = await fetch(`/api/reading/${bookId}`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to load');
      const data = await res.json();
      setBook(data.book);
    } catch (error) {
      console.error('Error loading book:', error);
      alert('Failed to load book');
    } finally {
      setLoading(false);
    }
  }

  async function saveBook(e: React.FormEvent) {
    e.preventDefault();
    if (!book) return;
    
    setSaving(true);
    try {
      const res = await fetch(`/api/reading/${bookId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(book),
      });
      if (!res.ok) throw new Error('Failed to save');
      alert('Book updated successfully!');
    } catch (error) {
      console.error('Error saving:', error);
      alert('Failed to save book');
    } finally {
      setSaving(false);
    }
  }

  async function addNote(e: React.FormEvent) {
    e.preventDefault();
    if (!noteForm.page || !noteForm.note) return;
    
    try {
      const res = await fetch(`/api/reading/${bookId}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page: Number(noteForm.page),
          note: noteForm.note,
          chapter: noteForm.chapter || undefined,
          date: new Date().toISOString().slice(0, 10),
        }),
      });
      
      if (!res.ok) throw new Error('Failed to add note');
      
      setNoteForm({ page: '', note: '', chapter: '' });
      await loadBook();
    } catch (error) {
      console.error('Error adding note:', error);
      alert('Failed to add note');
    }
  }

  async function deleteNote(noteId: string) {
    if (!confirm('Delete this note?')) return;
    
    try {
      const res = await fetch(`/api/reading/${bookId}/notes?noteId=${noteId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete');
      await loadBook();
    } catch (error) {
      console.error('Error deleting note:', error);
      alert('Failed to delete note');
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-slate-600 dark:text-slate-400">Loading...</div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600 dark:text-red-400">Book not found</div>
      </div>
    );
  }

  const progress = book.totalPages > 0 
    ? Math.round((book.currentPage / book.totalPages) * 100) 
    : 0;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push('/admin/reading')}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        </button>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
          Edit Book
        </h1>
      </div>

      {/* Book Details Form */}
      <form onSubmit={saveBook} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Title">
            <input
              value={book.title}
              onChange={e => setBook({ ...book, title: e.target.value })}
              className="input"
              required
            />
          </Field>
          <Field label="Author">
            <input
              value={book.author}
              onChange={e => setBook({ ...book, author: e.target.value })}
              className="input"
              required
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Genre">
            <select
              value={book.genre}
              onChange={e => setBook({ ...book, genre: e.target.value as any })}
              className="input"
            >
              <option>Business</option>
              <option>Tech</option>
              <option>Christian</option>
              <option>Others</option>
            </select>
          </Field>
          <Field label="Status">
            <select
              value={book.status}
              onChange={e => setBook({ ...book, status: e.target.value as any })}
              className="input"
            >
              <option value="currently-reading">Currently Reading</option>
              <option value="finished">Finished</option>
              <option value="want-to-read">Want to Read</option>
            </select>
          </Field>
          <Field label="Rating (1-5)">
            <input
              type="number"
              min={1}
              max={5}
              value={book.rating || ''}
              onChange={e => setBook({ ...book, rating: e.target.value ? Number(e.target.value) : undefined })}
              className="input"
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Current Page">
            <input
              type="number"
              value={book.currentPage}
              onChange={e => setBook({ ...book, currentPage: Number(e.target.value) })}
              className="input"
            />
          </Field>
          <Field label="Total Pages">
            <input
              type="number"
              value={book.totalPages}
              onChange={e => setBook({ ...book, totalPages: Number(e.target.value) })}
              className="input"
            />
          </Field>
          <Field label="Start Date">
            <input
              type="date"
              value={book.startDate}
              onChange={e => setBook({ ...book, startDate: e.target.value })}
              className="input"
            />
          </Field>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
            <div
              className={`h-3 rounded-full bg-gradient-to-r ${book.coverColor || 'from-blue-400 to-indigo-500'}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Cover Color Picker */}
        <Field label="Cover Color">
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
            {COVER_COLORS.map(color => (
              <button
                key={color}
                type="button"
                onClick={() => setBook({ ...book, coverColor: color })}
                className={`h-12 rounded-lg bg-gradient-to-br ${color} transition-all ${
                  book.coverColor === color 
                    ? 'ring-4 ring-blue-500 ring-offset-2 dark:ring-offset-slate-800' 
                    : 'hover:scale-105'
                }`}
              />
            ))}
          </div>
        </Field>

        <Field label="Short Thoughts">
          <textarea
            value={book.thoughts || ''}
            onChange={e => setBook({ ...book, thoughts: e.target.value })}
            className="input min-h-[80px] resize-y"
            placeholder="Quick thoughts about this book..."
          />
        </Field>

        <Field label="Full Review">
          <textarea
            value={book.review || ''}
            onChange={e => setBook({ ...book, review: e.target.value })}
            className="input min-h-[150px] resize-y"
            placeholder="Detailed review, key takeaways, and insights..."
          />
        </Field>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>

      {/* Notes Section */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 space-y-6">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          Reading Notes ({book.notes.length})
        </h2>

        {/* Add Note Form */}
        <form onSubmit={addNote} className="space-y-4 border-b border-slate-200 dark:border-slate-700 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Page Number">
              <input
                type="number"
                value={noteForm.page}
                onChange={e => setNoteForm({ ...noteForm, page: e.target.value })}
                className="input"
                placeholder="123"
                required
              />
            </Field>
            <Field label="Chapter (optional)">
              <input
                value={noteForm.chapter}
                onChange={e => setNoteForm({ ...noteForm, chapter: e.target.value })}
                className="input"
                placeholder="Chapter 5"
              />
            </Field>
            <div className="flex items-end">
              <button type="submit" className="btn-primary w-full">
                <Plus className="w-4 h-4" />
                Add Note
              </button>
            </div>
          </div>
          <Field label="Note">
            <textarea
              value={noteForm.note}
              onChange={e => setNoteForm({ ...noteForm, note: e.target.value })}
              className="input min-h-[100px] resize-y"
              placeholder="Your insights, quotes, or thoughts from this page..."
              required
            />
          </Field>
        </form>

        {/* Notes List */}
        <div className="space-y-4">
          {book.notes.length === 0 ? (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
              No notes yet. Add your first note above!
            </div>
          ) : (
            book.notes
              .sort((a, b) => b.page - a.page)
              .map(note => (
                <div
                  key={note.id}
                  className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-blue-600 dark:text-blue-400">
                        Page {note.page}
                      </span>
                      {note.chapter && (
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                          • {note.chapter}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 p-1.5 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 mb-2 whitespace-pre-wrap">
                    {note.note}
                  </p>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {new Date(note.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              ))
          )}
        </div>
      </div>

      <style jsx>{`
        .input {
          @apply w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400;
        }
        .btn-primary {
          @apply flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed;
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="space-y-2">
      <span className="block text-sm font-semibold text-slate-900 dark:text-slate-100">
        {label}
      </span>
      <div>{children}</div>
    </label>
  );
}