'use client'

import React, { useEffect, useState } from 'react';

type Project = {
  id: string;
  title: string;
  description?: string;
  longDescription?: string;
  image?: string;
  technologies?: { name: string; icon?: string }[];
  date?: string;
  githubUrl?: string;
  liveUrl?: string;
  category?: string;
  featured?: boolean;
};

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Partial<Project>>({ 
    title: '', 
    description: '', 
    longDescription: '',
    category: 'General', 
    featured: false,
    technologies: []
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  async function load() {
    setLoading(true);
    const res = await fetch('/api/projects', { cache: 'no-store' });
    const data = await res.json();
    setProjects(data.projects || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  async function createProject(e: React.FormEvent) {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', form.title || '');
    formData.append('description', form.description || '');
    formData.append('longDescription', form.longDescription || '');
    formData.append('category', form.category || 'General');
    formData.append('featured', String(form.featured || false));
    formData.append('technologies', JSON.stringify(form.technologies || []));
    if (form.date) formData.append('date', form.date);
    if (form.githubUrl) formData.append('githubUrl', form.githubUrl);
    if (form.liveUrl) formData.append('liveUrl', form.liveUrl);
    if (imageFile) formData.append('image', imageFile);
    
    const res = await fetch('/api/projects', { method: 'POST', body: formData });
    if (res.ok) {
      setForm({ title: '', description: '', longDescription: '', category: 'General', featured: false, technologies: [] });
      setImageFile(null);
      setImagePreview('');
      await load();
    }
  }

  async function deleteProject(id: string) {
    if (confirm('Are you sure you want to delete this project?')) {
      await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      await load();
    }
  }

  const addTechnology = () => {
    const name = prompt('Technology name:');
    if (name) {
      setForm(v => ({
        ...v,
        technologies: [...(v.technologies || []), { name }]
      }));
    }
  };

  const removeTechnology = (index: number) => {
    setForm(v => ({
      ...v,
      technologies: (v.technologies || []).filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Projects</h2>
      <form onSubmit={createProject} className="space-y-4 max-w-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 rounded-xl">
        <div>
          <label className="block font-semibold mb-2 text-slate-900 dark:text-slate-100">Title *</label>
          <input 
            value={form.title || ''} 
            onChange={e => setForm(v => ({ ...v, title: e.target.value }))} 
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400" 
            required 
          />
        </div>
        
        <div>
          <label className="block font-semibold mb-2 text-slate-900 dark:text-slate-100">Short Description</label>
          <textarea 
            value={form.description || ''} 
            onChange={e => setForm(v => ({ ...v, description: e.target.value }))} 
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 min-h-[80px] resize-y" 
          />
        </div>
        
        <div>
          <label className="block font-semibold mb-2 text-slate-900 dark:text-slate-100">Long Description</label>
          <textarea 
            value={form.longDescription || ''} 
            onChange={e => setForm(v => ({ ...v, longDescription: e.target.value }))} 
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 min-h-[120px] resize-y" 
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-2 text-slate-900 dark:text-slate-100">Category</label>
            <input 
              value={form.category || ''} 
              onChange={e => setForm(v => ({ ...v, category: e.target.value }))} 
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400" 
            />
          </div>
          <div>
            <label className="block font-semibold mb-2 text-slate-900 dark:text-slate-100">Date</label>
            <input 
              type="date"
              value={form.date || ''} 
              onChange={e => setForm(v => ({ ...v, date: e.target.value }))} 
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400" 
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-2 text-slate-900 dark:text-slate-100">Live URL</label>
            <input 
              type="url"
              value={form.liveUrl || ''} 
              onChange={e => setForm(v => ({ ...v, liveUrl: e.target.value }))} 
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400" 
            />
          </div>
          <div>
            <label className="block font-semibold mb-2 text-slate-900 dark:text-slate-100">GitHub URL</label>
            <input 
              type="url"
              value={form.githubUrl || ''} 
              onChange={e => setForm(v => ({ ...v, githubUrl: e.target.value }))} 
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400" 
            />
          </div>
        </div>
        
        <div>
          <label className="block font-semibold mb-2 text-slate-900 dark:text-slate-100">Technologies</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {(form.technologies || []).map((tech, idx) => (
              <span key={idx} className="px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
                {tech.name}
                <button 
                  type="button"
                  onClick={() => removeTechnology(idx)}
                  className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <button 
            type="button"
            onClick={addTechnology}
            className="px-3 py-1.5 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors text-sm"
          >
            + Add Technology
          </button>
        </div>
        
        <div>
          <label className="block font-semibold mb-2 text-slate-900 dark:text-slate-100">Project Image</label>
          <input 
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          />
          {imagePreview && (
            <div className="mt-2">
              <img src={imagePreview} alt="Preview" className="max-w-xs rounded-lg border border-slate-200 dark:border-slate-700" />
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          <input 
            id="featured" 
            type="checkbox" 
            checked={!!form.featured} 
            onChange={e => setForm(v => ({ ...v, featured: e.target.checked }))}
            className="w-4 h-4 text-blue-600 bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded focus:ring-blue-500 dark:focus:ring-blue-400"
          />
          <label htmlFor="featured" className="text-slate-900 dark:text-slate-100">Featured</label>
        </div>
        
        <div>
          <button 
            type="submit" 
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
          >
            Create Project
          </button>
        </div>
      </form>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-slate-100">Existing Projects</h3>
        {loading ? (
          <div className="text-slate-600 dark:text-slate-400">Loading...</div>
        ) : (
          <ul className="space-y-3">
            {projects.map(p => (
              <li 
                key={p.id} 
                className="flex justify-between items-center border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 rounded-lg hover:shadow-md dark:hover:shadow-slate-900/50 transition-shadow"
              >
                <div className="flex items-center gap-4">
                  {p.image && (
                    <img src={p.image} alt={p.title} className="w-16 h-16 object-cover rounded-lg" />
                  )}
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-slate-100">{p.title}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">{p.category} {p.featured && '• Featured'}</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <a 
                    href={`/admin/projects/${p.id}`} 
                    className="px-3 py-1.5 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors text-sm font-medium"
                  >
                    Edit
                  </a>
                  <button 
                    onClick={() => deleteProject(p.id)} 
                    className="px-3 py-1.5 border border-red-300 dark:border-red-700 rounded-md bg-white dark:bg-slate-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}


