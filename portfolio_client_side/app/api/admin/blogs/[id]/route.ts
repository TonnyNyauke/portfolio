import { NextResponse } from 'next/server';
import { readJsonFile, writeJsonFile } from '@/lib/fileStore';

type Blog = {
  id: string;
  title: string;
  category?: 'Business' | 'Tech' | 'Faith' | 'Others';
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  tags: string[];
  featured: boolean;
  views?: number;
  coverImage?: string;
};

const FILE = 'blogs.json';

export async function GET(
  _: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const blogs = await readJsonFile<Blog[]>(FILE, []);
  const blog = blogs.find(b => b.id === id);
  if (!blog) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ blog });
}

export async function PUT(
  request: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updates = (await request.json()) as Partial<Blog>;
    const blogs = await readJsonFile<Blog[]>(FILE, []);
    const index = blogs.findIndex(b => b.id === id);
    if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    
    const nextExcerpt = updates.excerpt || 
      (updates.title 
        ? updates.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') 
        : blogs[index].excerpt);
    
    const updated: Blog = { 
      ...blogs[index], 
      ...updates, 
      excerpt: nextExcerpt, 
      id 
    };
    
    blogs[index] = updated;
    await writeJsonFile(FILE, blogs);
    return NextResponse.json({ blog: updated });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(
  _: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const blogs = await readJsonFile<Blog[]>(FILE, []);
  const next = blogs.filter(b => b.id !== id);
  await writeJsonFile(FILE, next);
  return NextResponse.json({ ok: true });
}