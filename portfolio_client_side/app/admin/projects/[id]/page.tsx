'use client'

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

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

export default function EditProject() {
  const pathname = usePathname();
  const id = pathname.split('/').pop() as string;
  const [project, setProject] = useState<Project | null>(null);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  async function load() {
    const res = await fetch(`/api/admin/projects/${id}`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      setProject(data.project);
      setImagePreview(data.project.image || '');
    }
  }
  useEffect(() => { load(); }, [id]);

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

  async function save(updates: Partial<Project>) {
    setSaving(true);
    const formData = new FormData();
    Object.entries(updates).forEach(([key, value]) => {
      if (key === 'technologies') {
        formData.append(key, JSON.stringify(value));
      } else if (key === 'featured') {
        formData.append(key, String(value));
      } else if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });
    if (project?.image) {
      formData.append('imagePath', project.image);
    }
    if (imageFile) {
      formData.append('image', imageFile);
    }
    
    await fetch(`/api/admin/projects/${id}`, { method: 'PUT', body: formData });
    setSaving(false);
    await load();
  }

  const addTechnology = () => {
    const name = prompt('Technology name:');
    if (name && project) {
      const updated = {
        ...project,
        technologies: [...(project.technologies || []), { name }]
      };
      setProject(updated);
      save({ technologies: updated.technologies });
    }
  };

  const removeTechnology = (index: number) => {
    if (!project) return;
    const updated = {
      ...project,
      technologies: (project.technologies || []).filter((_, i) => i !== index)
    };
    setProject(updated);
    save({ technologies: updated.technologies });
  };

  if (!project) return <div className="text-slate-600 dark:text-slate-400">Loading...</div>;

  return (
    <div className="space-y-6">
      <a href="/admin/projects" className="text-blue-600 dark:text-blue-400 hover:underline">&larr; Back</a>
      <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{project.title}</h2>
      
      <section className="space-y-4 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 rounded-xl">
        <div>
          <label className="block font-semibold mb-2 text-slate-900 dark:text-slate-100">Title</label>
          <input 
            value={project.title} 
            onChange={e => setProject({ ...project, title: e.target.value })} 
            onBlur={() => save({ title: project.title })}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          />
        </div>
        
        <div>
          <label className="block font-semibold mb-2 text-slate-900 dark:text-slate-100">Short Description</label>
          <textarea 
            value={project.description || ''} 
            onChange={e => setProject({ ...project, description: e.target.value })} 
            onBlur={() => save({ description: project.description })}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 min-h-[80px] resize-y"
          />
        </div>
        
        <div>
          <label className="block font-semibold mb-2 text-slate-900 dark:text-slate-100">Long Description</label>
          <textarea 
            value={project.longDescription || ''} 
            onChange={e => setProject({ ...project, longDescription: e.target.value })} 
            onBlur={() => save({ longDescription: project.longDescription })}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 min-h-[120px] resize-y"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-2 text-slate-900 dark:text-slate-100">Category</label>
            <input 
              value={project.category || ''} 
              onChange={e => setProject({ ...project, category: e.target.value })} 
              onBlur={() => save({ category: project.category })}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block font-semibold mb-2 text-slate-900 dark:text-slate-100">Date</label>
            <input 
              type="date"
              value={project.date || ''} 
              onChange={e => setProject({ ...project, date: e.target.value })} 
              onBlur={() => save({ date: project.date })}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-2 text-slate-900 dark:text-slate-100">Live URL</label>
            <input 
              type="url"
              value={project.liveUrl || ''} 
              onChange={e => setProject({ ...project, liveUrl: e.target.value })} 
              onBlur={() => save({ liveUrl: project.liveUrl })}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block font-semibold mb-2 text-slate-900 dark:text-slate-100">GitHub URL</label>
            <input 
              type="url"
              value={project.githubUrl || ''} 
              onChange={e => setProject({ ...project, githubUrl: e.target.value })} 
              onBlur={() => save({ githubUrl: project.githubUrl })}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>
        
        <div>
          <label className="block font-semibold mb-2 text-slate-900 dark:text-slate-100">Technologies</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {(project.technologies || []).map((tech, idx) => (
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
          {imagePreview && (
            <div className="mb-2">
              <img src={imagePreview} alt="Preview" className="max-w-xs rounded-lg border border-slate-200 dark:border-slate-700" />
            </div>
          )}
          <input 
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          />
          {imageFile && (
            <button
              type="button"
              onClick={() => save({ image: project.image })}
              className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
            >
              Upload New Image
            </button>
          )}
        </div>
        
        <label className="flex items-center gap-3 cursor-pointer">
          <input 
            type="checkbox" 
            checked={!!project.featured} 
            onChange={e => { const featured = e.target.checked; setProject({ ...project, featured }); save({ featured }); }}
            className="w-4 h-4 text-blue-600 bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded focus:ring-blue-500 dark:focus:ring-blue-400"
          />
          <span className="text-slate-900 dark:text-slate-100">Featured</span>
        </label>
        
        {saving && <div className="text-sm text-slate-600 dark:text-slate-400">Saving...</div>}
      </section>
    </div>
  );
}

