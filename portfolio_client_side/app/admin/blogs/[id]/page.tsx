'use client'

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

type Blog = {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  content: string;
  tags?: string[];
  date: string;
  published: boolean;
};

export default function EditBlog() {
  const pathname = usePathname();
  const id = pathname.split('/').pop() as string;
  const [blog, setBlog] = useState<Blog | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    const res = await fetch(`/api/blogs/${id}`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      setBlog(data.blog);
    }
  }
  useEffect(() => { load(); }, [id]);

  async function save(updates: Partial<Blog>) {
    setSaving(true);
    await fetch(`/api/blogs/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updates) });
    setSaving(false);
    await load();
  }

  if (!blog) return <div className="text-slate-600 dark:text-slate-400">Loading...</div>;

  return (
    <div className="space-y-6">
      <a href="/admin/blogs" className="text-blue-600 dark:text-blue-400 hover:underline">&larr; Back</a>
      <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{blog.title}</h2>
      <section className="space-y-4 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 rounded-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Title">
            <input 
              value={blog.title} 
              onChange={e => setBlog({ ...blog, title: e.target.value })} 
              onBlur={() => save({ title: blog.title })}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
          </Field>
          <Field label="Slug">
            <input 
              value={blog.slug} 
              onChange={e => setBlog({ ...blog, slug: e.target.value })} 
              onBlur={() => save({ slug: blog.slug })}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
          </Field>
        </div>
        <Field label="Summary">
          <textarea 
            value={blog.summary || ''} 
            onChange={e => setBlog({ ...blog, summary: e.target.value })} 
            onBlur={() => save({ summary: blog.summary })}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 resize-y"
          />
        </Field>
        <Field label="Tags (comma-separated)">
          <input 
            value={(blog.tags || []).join(', ')} 
            onChange={e => setBlog({ ...blog, tags: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} 
            onBlur={() => save({ tags: blog.tags })}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          />
        </Field>
        <Field label="Content (Markdown)">
          <textarea 
            value={blog.content} 
            onChange={e => setBlog({ ...blog, content: e.target.value })} 
            onBlur={() => save({ content: blog.content })}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 min-h-[240px] resize-y font-mono text-sm"
          />
        </Field>
        <label className="flex items-center gap-3 cursor-pointer">
          <input 
            type="checkbox" 
            checked={!!blog.published} 
            onChange={e => { const published = e.target.checked; setBlog({ ...blog, published }); save({ published }); }}
            className="w-4 h-4 text-blue-600 bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded focus:ring-blue-500 dark:focus:ring-blue-400"
          />
          <span className="text-slate-900 dark:text-slate-100">Published</span>
        </label>
        {saving && <div className="text-sm text-slate-600 dark:text-slate-400">Saving...</div>}
      </section>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="space-y-2">
      <span className="block font-semibold text-slate-900 dark:text-slate-100">{label}</span>
      <div>{children}</div>
    </label>
  );
}


