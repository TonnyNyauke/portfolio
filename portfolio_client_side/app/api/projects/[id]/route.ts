import { NextResponse } from 'next/server'
import { getProjectById, updateProject, deleteProject } from '@/lib/db/projects'
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

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const project = await getProjectById(id)

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    return NextResponse.json({ project })
  } catch (error: any) {
    console.error('Error fetching project:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch project' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const formData = await request.formData()
    
    const existing = await getProjectById(id)
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    
    const title = formData.get('title') as string || existing.title
    const description = formData.get('description') as string || existing.description
    const longDescription = formData.get('longDescription') as string || existing.longDescription
    const category = formData.get('category') as string || existing.category
    const featured = formData.get('featured') === 'true'
    const date = formData.get('date') as string || existing.date
    const githubUrl = formData.get('githubUrl') as string || existing.githubUrl
    const liveUrl = formData.get('liveUrl') as string || existing.liveUrl
    const technologiesStr = formData.get('technologies') as string || JSON.stringify(existing.technologies)
    const imageFile = formData.get('image') as File | null
    
    // Handle image upload
    let imagePath = formData.get('imagePath') as string || existing.image
    if (imageFile && imageFile.size > 0) {
      const filename = `${id}-${imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '-')}`
      imagePath = await saveImage(imageFile, filename)
    }
    
    const technologies = JSON.parse(technologiesStr) || []
    
    const updates: Partial<ProjectDetails> = {
      title,
      description,
      longDescription,
      image: imagePath,
      technologies,
      date,
      githubUrl,
      liveUrl,
      category,
      featured
    }
    
    const updated = await updateProject(id, updates)
    return NextResponse.json({ project: updated })
  } catch (e: any) {
    console.error('Error updating project:', e)
    return NextResponse.json({ error: e?.message || 'Failed to update' }, { status: 500 })
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await deleteProject(id)
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    console.error('Error deleting project:', e)
    return NextResponse.json({ error: e?.message || 'Failed to delete' }, { status: 500 })
  }
}

