'use client'

import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';

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

export default function AdminReading() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<Book>>({
    title: '',
    author: '',
    genre: 'Others',
    currentPage: 0,
    totalPages: 0,
    status: 'currently-reading',
    coverColor: 'from-blue-400 to-indigo-500',
    startDate: new Date().toISOString().slice(0, 10),
  });

  const percentages = useMemo(
    () => Object.fromEntries(books.map(b => [b.id, percent(b.currentPage, b.totalPages)])),
    [books]
  );

  async function load() {
    setLoading(true);
    const res = await fetch('/api/admin/reading', { cache: 'no-store' });
    const data = await res.json();
    setBooks(data.books || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function createBook(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/admin/reading', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setForm({
        title: '',
        author: '',
        genre: 'Others',
        currentPage: 0,
        totalPages: 0,
        status: 'currently-reading',
        coverColor: 'from-blue-400 to-indigo-500',
        startDate: new Date().toISOString().slice(0, 10),
      });
      setShowForm(false);
      await load();
    }
  }

  async function deleteBook(id: string) {
    if (!confirm('Delete this book? This will also delete all notes.')) return;
    await fetch(`/api/admin/reading/${id}`, { method: 'DELETE' });
    await load();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
          Reading Library
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary"
        >
          <Plus className="w-4 h-4" />
          Add New Book
        </button>
      </div>

      {/* Add Book Form */}
      {showForm && (
        <form
          onSubmit={createBook}
          className="space-y-4 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 rounded-xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Title">
              <input
                value={form.title || ''}
                onChange={e => setForm(v => ({ ...v, title: e.target.value }))}
                className="input"
                required
              />
            </Field>
            <Field label="Author">
              <input
                value={form.author || ''}
                onChange={e => setForm(v => ({ ...v, author: e.target.value }))}
                className="input"
                required
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Genre">
              <select
                value={form.genre as any}
                onChange={e => setForm(v => ({ ...v, genre: e.target.value as any }))}
                className="input"
              >
                <option>Business</option>
                <option>Tech</option>
                <option>Christian</option>
                <option>Others</option>
              </select>
            </Field>
            <Field label="Current Page">
              <input
                type="number"
                value={(form.currentPage as number) || 0}
                onChange={e => setForm(v => ({ ...v, currentPage: Number(e.target.value) }))}
                className="input"
              />
            </Field>
            <Field label="Total Pages">
              <input
                type="number"
                value={(form.totalPages as number) || 0}
                onChange={e => setForm(v => ({ ...v, totalPages: Number(e.target.value) }))}
                className="input"
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Status">
              <select
                value={form.status as any}
                onChange={e => setForm(v => ({ ...v, status: e.target.value as any }))}
                className="input"
              >
                <option value="currently-reading">Currently Reading</option>
                <option value="finished">Finished</option>
                <option value="want-to-read">Want to Read</option>
              </select>
            </Field>
            <Field label="Start Date">
              <input
                type="date"
                value={form.startDate || ''}
                onChange={e => setForm(v => ({ ...v, startDate: e.target.value }))}
                className="input"
              />
            </Field>
          </div>

          <Field label="Cover Color">
            <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
              {COVER_COLORS.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setForm(v => ({ ...v, coverColor: color }))}
                  className={`h-12 rounded-lg bg-gradient-to-br ${color} transition-all ${
                    form.coverColor === color
                      ? 'ring-4 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900'
                      : 'hover:scale-105'
                  }`}
                />
              ))}
            </div>
          </Field>

          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary">
              <Plus className="w-4 h-4" />
              Add Book
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Books List */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-slate-100">
          Books ({books.length})
        </h3>
        {loading ? (
          <div className="text-slate-600 dark:text-slate-400">Loading...</div>
        ) : books.length === 0 ? (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400">
            No books yet. Add your first book to get started!
          </div>
        ) : (
          <div className="grid gap-4">
            {books.map(b => (
              <div
                key={b.id}
                className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg hover:shadow-md dark:hover:shadow-slate-900/50 transition-shadow overflow-hidden"
              >
                <div className="p-4 flex items-center gap-4">
                  {/* Book Cover Preview */}
                  <div
                    className={`w-16 h-20 bg-gradient-to-br ${
                      b.coverColor || 'from-blue-400 to-indigo-500'
                    } rounded-lg flex-shrink-0 shadow-md`}
                  />

                  {/* Book Info */}
                  <div className="flex-grow min-w-0">
                    <div className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                      {b.title}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      by {b.author}
                    </div>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-xs px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded">
                        {b.genre}
                      </span>
                      <span className="text-xs px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded">
                        {b.status}
                      </span>
                      <span className="text-xs text-slate-600 dark:text-slate-400">
                        {percentages[b.id]}% complete
                      </span>
                      {b.notes.length > 0 && (
                        <span className="text-xs text-blue-600 dark:text-blue-400">
                          {b.notes.length} notes
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 flex-shrink-0">
                    <a
                      href={`/admin/reading/${b.id}`}
                      className="p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
                      title="Edit book"
                    >
                      <Edit className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => deleteBook(b.id)}
                      className="p-2 border border-red-300 dark:border-red-700 rounded-md bg-white dark:bg-slate-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      title="Delete book"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                {b.status !== 'want-to-read' && (
                  <div className="px-4 pb-4">
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full bg-gradient-to-r ${
                          b.coverColor || 'from-blue-400 to-indigo-500'
                        }`}
                        style={{ width: `${percentages[b.id]}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .input {
          @apply w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400;
        }
        .btn-primary {
          @apply flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg font-medium transition-colors;
        }
      `}</style>
    </div>
  );
}

function percent(current: number, total: number) {
  if (!total || total <= 0) return 0;
  return Math.round((current / total) * 100);
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