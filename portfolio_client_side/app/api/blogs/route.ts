import { NextResponse } from 'next/server'
import { readJsonFile } from '@/lib/fileStore'
import type { Blog } from '@/app/api/admin/blogs/route'

const FILE = 'blogs.json'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const category = searchParams.get('category')?.toLowerCase()
  const exclude = searchParams.get('exclude')
  const limit = Number.parseInt(searchParams.get('limit') ?? '', 10)

  let blogs = await readJsonFile<Blog[]>(FILE, [])

  if (category) {
    blogs = blogs.filter(blog => blog.category?.toLowerCase() === category)
  }

  if (exclude) {
    blogs = blogs.filter(blog => blog.id !== exclude)
  }

  if (!Number.isNaN(limit) && limit > 0) {
    blogs = blogs.slice(0, limit)
  }

  return NextResponse.json({ blogs })
}

