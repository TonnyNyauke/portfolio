import { NextResponse } from 'next/server'
import { getAllProjects, createProject } from '@/lib/db/projects'
import { ProjectDetails } from '@/app/projects/project'
import { promises as fs } from 'fs'
import { join } from 'path'

const PUBLIC_DIR = join(process.cwd(), 'public')

// Handle image upload (keeping existing file-based approach)
async function saveImage(file: File, filename: string): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  const filePath = join(PUBLIC_DIR, filename)
  await fs.writeFile(filePath, buffer)
  return `/${filename}`
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    const category = searchParams.get('category')
    const exclude = searchParams.get('exclude')
    const limit = Number.parseInt(searchParams.get('limit') ?? '', 10)
    const featured = searchParams.get('featured') === 'true' ? true : undefined

    const projects = await getAllProjects({
      category: category || undefined,
      exclude: exclude || undefined,
      limit: Number.isNaN(limit) ? undefined : limit,
      featured,
    })

    return NextResponse.json({ projects })
  } catch (error: any) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const longDescription = formData.get('longDescription') as string || ''
    const category = formData.get('category') as string || 'General'
    const featured = formData.get('featured') === 'true'
    const date = formData.get('date') as string || undefined
    const githubUrl = formData.get('githubUrl') as string || undefined
    const liveUrl = formData.get('liveUrl') as string || undefined
    const technologiesStr = formData.get('technologies') as string || '[]'
    const imageFile = formData.get('image') as File | null
    
    if (!title) {
      return NextResponse.json({ error: 'title is required' }, { status: 400 })
    }
    
    const id = formData.get('id') as string || `${Date.now()}`
    
    // Handle image upload
    let imagePath = formData.get('imagePath') as string || ''
    if (imageFile && imageFile.size > 0) {
      const filename = `${id}-${imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '-')}`
      imagePath = await saveImage(imageFile, filename)
    }
    
    const technologies = JSON.parse(technologiesStr) || []
    
    const project: Partial<ProjectDetails> = {
      id,
      title,
      description: description || '',
      longDescription: longDescription || description || '',
      image: imagePath,
      technologies,
      date,
      githubUrl,
      liveUrl,
      category,
      featured
    }
    
    const created = await createProject(project)
    return NextResponse.json({ project: created })
  } catch (e: any) {
    console.error('Error creating project:', e)
    return NextResponse.json({ error: e?.message || 'Failed to create' }, { status: 500 })
  }
}

