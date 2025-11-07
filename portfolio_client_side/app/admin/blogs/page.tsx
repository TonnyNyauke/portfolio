'use client'

import React, { useEffect, useState } from 'react';
import { BookOpen, Tag, Calendar, Clock, Eye, Star, Trash2, Edit3, Plus, Save, X } from 'lucide-react';

type Category = 'Business' | 'Tech' | 'Faith & Business' | 'Others';

type Thought = {
  id: string;
  title: string;
  category: Category;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  tags: string[];
  featured: boolean;
  views?: number;
  coverImage?: string;
};

const CATEGORIES: Category[] = ['Business', 'Tech', 'Faith & Business', 'Others'];

export default function AdminThoughts() {
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<Thought>>({
    title: '',
    category: 'Business',
    excerpt: '',
    content: '',
    tags: [],
    featured: false,
    readTime: '5 min read',
    coverImage: ''
  });

  async function load() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/blogs', { cache: 'no-store' });
      const data = await res.json();
      setThoughts(data.thoughts || []);
    } catch (error) {
      console.error('Failed to load thoughts:', error);
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function saveThought(e: React.FormEvent) {
    e.preventDefault();
    
    const payload = {
      ...form,
      date: form.date || new Date().toISOString().split('T')[0]
    };

    try {
      if (editingId) {
        await fetch(`/api/admin/blogs/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        await fetch('/api/admin/blogs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }
      resetForm();
      await load();
    } catch (error) {
      console.error('Failed to save thought:', error);
    }
  }

  async function deleteThought(id: string) {
    if (!confirm('Are you sure you want to delete this thought?')) return;
    
    try {
      await fetch(`/api/admin/blogs/${id}`, { method: 'DELETE' });
      await load();
    } catch (error) {
      console.error('Failed to delete thought:', error);
    }
  }

  function editThought(thought: Thought) {
    setForm(thought);
    setEditingId(thought.id);
    setShowForm(true);
  }

  function resetForm() {
    setForm({
      title: '',
      category: 'Business',
      excerpt: '',
      content: '',
      tags: [],
      featured: false,
      readTime: '5 min read',
      coverImage: ''
    });
    setEditingId(null);
    setShowForm(false);
  }

  const getCategoryColor = (category: Category) => {
    const colors = {
      'Business': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      'Tech': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
      'Faith & Business': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
      'Others': 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
    };
    return colors[category];
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3">
              <BookOpen className="w-8 h-8" />
              Thoughts Manager
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Create and manage your thoughts, insights, and articles
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg font-medium transition-colors shadow-sm"
          >
            {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showForm ? 'Cancel' : 'New Thought'}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <form onSubmit={saveThought} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 space-y-5">
            <div className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-slate-100 pb-3 border-b border-slate-200 dark:border-slate-700">
              <Edit3 className="w-5 h-5" />
              {editingId ? 'Edit Thought' : 'Create New Thought'}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Title" required>
                <input
                  value={form.title || ''}
                  onChange={e => setForm(v => ({ ...v, title: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  placeholder="Enter thought title..."
                  required
                />
              </Field>

              <Field label="Category" required>
                <select
                  value={form.category || 'Business'}
                  onChange={e => setForm(v => ({ ...v, category: e.target.value as Category }))}
                  className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  required
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label="Excerpt" required>
              <textarea
                value={form.excerpt || ''}
                onChange={e => setForm(v => ({ ...v, excerpt: e.target.value }))}
                className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 resize-y"
                rows={2}
                placeholder="Brief summary of your thought..."
                required
              />
            </Field>

            <Field label="Content (Markdown)" required>
              <textarea
                value={form.content || ''}
                onChange={e => setForm(v => ({ ...v, content: e.target.value }))}
                className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 min-h-[200px] resize-y font-mono text-sm"
                placeholder="Write your thought content in Markdown..."
                required
              />
            </Field>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <Field label="Read Time">
                <input
                  value={form.readTime || ''}
                  onChange={e => setForm(v => ({ ...v, readTime: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  placeholder="e.g., 5 min read"
                />
              </Field>

              <Field label="Cover Image URL">
                <input
                  value={form.coverImage || ''}
                  onChange={e => setForm(v => ({ ...v, coverImage: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  placeholder="https://..."
                />
              </Field>

              <Field label="Date">
                <input
                  type="date"
                  value={form.date || ''}
                  onChange={e => setForm(v => ({ ...v, date: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                />
              </Field>
            </div>

            <Field label="Tags (comma-separated)">
              <input
                value={(form.tags || []).join(', ')}
                onChange={e => setForm(v => ({ ...v, tags: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))}
                className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                placeholder="entrepreneurship, technology, faith"
              />
            </Field>

            <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
              <input
                type="checkbox"
                checked={!!form.featured}
                onChange={e => setForm(v => ({ ...v, featured: e.target.checked }))}
                className="w-5 h-5 text-blue-600 bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded focus:ring-blue-500 dark:focus:ring-blue-400"
              />
              <Star className="w-5 h-5 text-amber-500" />
              <span className="text-slate-900 dark:text-slate-100 font-medium">Feature this thought</span>
            </label>

            <div className="flex gap-3 pt-3">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg font-medium transition-colors shadow-sm"
              >
                <Save className="w-4 h-4" />
                {editingId ? 'Update' : 'Create'} Thought
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Thoughts List */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              Published Thoughts ({thoughts.length})
            </h2>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-600 dark:text-slate-400">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-3">Loading thoughts...</p>
            </div>
          ) : thoughts.length === 0 ? (
            <div className="p-12 text-center text-slate-600 dark:text-slate-400">
              <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No thoughts yet. Create your first one!</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
              {thoughts.map(thought => (
                <div
                  key={thought.id}
                  className="p-6 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <div className="flex gap-4">
                    {thought.coverImage && (
                      <div className="flex-shrink-0 w-24 h-24 rounded-lg bg-slate-200 dark:bg-slate-700 overflow-hidden">
                        <img
                          src={thought.coverImage}
                          alt={thought.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 truncate">
                              {thought.title}
                            </h3>
                            {thought.featured && (
                              <Star className="w-5 h-5 text-amber-500 fill-amber-500 flex-shrink-0" />
                            )}
                          </div>
                          
                          <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 mb-3">
                            {thought.excerpt}
                          </p>
                          
                          <div className="flex flex-wrap items-center gap-3 text-sm">
                            <span className={`px-3 py-1 rounded-full font-medium ${getCategoryColor(thought.category)}`}>
                              {thought.category}
                            </span>
                            
                            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                              <Calendar className="w-4 h-4" />
                              {thought.date}
                            </div>
                            
                            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                              <Clock className="w-4 h-4" />
                              {thought.readTime}
                            </div>
                            
                            {thought.views !== undefined && (
                              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                                <Eye className="w-4 h-4" />
                                {thought.views}
                              </div>
                            )}
                          </div>
                          
                          {thought.tags && thought.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {thought.tags.map((tag, i) => (
                                <span
                                  key={i}
                                  className="flex items-center gap-1 text-xs px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded"
                                >
                                  <Tag className="w-3 h-3" />
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex gap-2 flex-shrink-0">
                          <button
                            onClick={() => editThought(thought)}
                            className="p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteThought(thought.id)}
                            className="p-2 border border-red-300 dark:border-red-700 rounded-lg bg-white dark:bg-slate-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block space-y-2">
      <span className="block text-sm font-semibold text-slate-900 dark:text-slate-100">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </span>
      {children}
    </label>
  );
}