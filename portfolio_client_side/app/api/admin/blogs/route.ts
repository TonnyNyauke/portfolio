import { NextResponse } from 'next/server';
import { readJsonFile, writeJsonFile } from '@/lib/fileStore';

export type Blog = {
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

export async function GET() {
  const data = await readJsonFile<Blog[]>(FILE, []);
  return NextResponse.json({ blogs: data });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<Blog>;
    if (!body.title) return NextResponse.json({ error: 'title is required' }, { status: 400 });
    const blogs = await readJsonFile<Blog[]>(FILE, []);
    const id = body.id || `${Date.now()}`;
    const blog: Blog = {
      id, title: body.title!, category: body.category, excerpt: body.excerpt || '', content: body.content || '', tags: body.tags || [], date: body.date || new Date().toISOString(),
      readTime: '',
      featured: body.featured ?? false
    };
    blogs.push(blog);
    await writeJsonFile(FILE, blogs);
    return NextResponse.json({ blog });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed to create' }, { status: 500 });
  }
}


