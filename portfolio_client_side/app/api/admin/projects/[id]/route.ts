import { NextResponse } from 'next/server';
import { readProjectData, writeProjectData } from '@/lib/projectDataStore';
import { ProjectDetails } from '@/app/projects/project';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const projects = await readProjectData();
  const project = projects.find(p => p.id === id);
  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ project });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const formData = await request.formData();
    const projects = await readProjectData();
    const index = projects.findIndex(p => p.id === id);
    if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    
    const existing = projects[index];
    const title = formData.get('title') as string || existing.title;
    const description = formData.get('description') as string || existing.description;
    const longDescription = formData.get('longDescription') as string || existing.longDescription;
    const category = formData.get('category') as string || existing.category;
    const featured = formData.get('featured') === 'true';
    const date = formData.get('date') as string || existing.date;
    const githubUrl = formData.get('githubUrl') as string || existing.githubUrl;
    const liveUrl = formData.get('liveUrl') as string || existing.liveUrl;
    const technologiesStr = formData.get('technologies') as string || JSON.stringify(existing.technologies);
    const imageFile = formData.get('image') as File | null;
    
    // Handle image upload
    let imagePath = formData.get('imagePath') as string || existing.image;
    if (imageFile && imageFile.size > 0) {
      const { saveImage } = await import('@/lib/projectDataStore');
      const filename = `${id}-${imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '-')}`;
      imagePath = await saveImage(imageFile, filename);
    }
    
    const technologies = JSON.parse(technologiesStr) || [];
    
    const updated: ProjectDetails = {
      ...existing,
      id,
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
    };
    
    projects[index] = updated;
    await writeProjectData(projects);
    return NextResponse.json({ project: updated });
  } catch (e: any) {
    console.error('Error updating project:', e);
    return NextResponse.json({ error: e?.message || 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const projects = await readProjectData();
  const next = projects.filter(p => p.id !== id);
  await writeProjectData(next);
  return NextResponse.json({ ok: true });
}