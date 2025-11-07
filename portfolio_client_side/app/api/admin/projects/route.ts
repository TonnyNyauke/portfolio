import { NextResponse } from 'next/server';
import { readProjectData, writeProjectData } from '@/lib/projectDataStore';
import { ProjectDetails } from '@/app/projects/project';

export async function GET() {
  const projects = await readProjectData();
  return NextResponse.json({ projects });
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const longDescription = formData.get('longDescription') as string || '';
    const category = formData.get('category') as string || 'General';
    const featured = formData.get('featured') === 'true';
    const date = formData.get('date') as string || undefined;
    const githubUrl = formData.get('githubUrl') as string || undefined;
    const liveUrl = formData.get('liveUrl') as string || undefined;
    const technologiesStr = formData.get('technologies') as string || '[]';
    const imageFile = formData.get('image') as File | null;
    
    if (!title) {
      return NextResponse.json({ error: 'title is required' }, { status: 400 });
    }
    
    const projects = await readProjectData();
    const id = formData.get('id') as string || `${Date.now()}`;
    
    // Handle image upload
    let imagePath = formData.get('imagePath') as string || '';
    if (imageFile && imageFile.size > 0) {
      const { saveImage } = await import('@/lib/projectDataStore');
      const filename = `${id}-${imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '-')}`;
      imagePath = await saveImage(imageFile, filename);
    }
    
    const technologies = JSON.parse(technologiesStr) || [];
    
    const project: ProjectDetails = {
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
    };
    
    projects.push(project);
    await writeProjectData(projects);
    return NextResponse.json({ project });
  } catch (e: any) {
    console.error('Error creating project:', e);
    return NextResponse.json({ error: e?.message || 'Failed to create' }, { status: 500 });
  }
}


