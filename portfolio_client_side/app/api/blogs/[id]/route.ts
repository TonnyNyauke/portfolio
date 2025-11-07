import { NextResponse } from 'next/server'
import { readJsonFile } from '@/lib/fileStore'
import type { Blog } from '@/app/api/admin/blogs/route'

const FILE = 'blogs.json'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  if (!id) {
    return NextResponse.json(
      { error: 'Blog ID is required' },
      { status: 400 }
    )
  }

  const blogs = await readJsonFile<Blog[]>(FILE, [])
  const blog = blogs.find(b => b.id === id)

  if (!blog) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json({ blog })
}

