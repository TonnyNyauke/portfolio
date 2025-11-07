import { promises as fs } from 'fs';
import { join } from 'path';
import { ProjectDetails } from '@/app/projects/project';

const PROJECT_DATA_FILE = join(process.cwd(), 'app', 'projects', 'projectData.ts');
const PUBLIC_DIR = join(process.cwd(), 'public');

// Read projectData.ts file by dynamically importing it
export async function readProjectData(): Promise<ProjectDetails[]> {
  try {
    // Dynamic import - convert image imports to paths for admin use
    const module = await import('@/app/projects/projectData');
    const projects = module.projectData || [];
    
    // Convert StaticImageData to string paths for admin UI
    return projects.map(project => ({
      ...project,
      image: typeof project.image === 'object' && 'src' in project.image 
        ? project.image.src 
        : (typeof project.image === 'string' ? project.image : '')
    })) as any[];
  } catch (err: any) {
    console.error('Error reading project data:', err);
    return [];
  }
}

// Write projectData.ts file
export async function writeProjectData(projects: ProjectDetails[]): Promise<void> {
  // Generate imports for images - track unique image paths
  const imagePaths = new Set<string>();
  const imageMap: Record<string, string> = {};
  
  projects.forEach(project => {
    if (typeof project.image === 'string' && project.image.startsWith('/')) {
      imagePaths.add(project.image);
    }
  });
  
  // Generate import names for each image
  const imports: string[] = ["import { ProjectDetails } from './project';"];
  const importMap: Record<string, string> = {};
  
  Array.from(imagePaths).sort().forEach((path, index) => {
    const filename = path.split('/').pop() || '';
    const baseName = filename.replace(/\.(png|jpg|jpeg|gif|webp|svg)$/i, '').replace(/[^a-zA-Z0-9]/g, '');
    const importName = baseName || `image${index}`;
    const relativePath = path.replace(/^\//, '../../public/');
    imports.push(`import ${importName} from '${relativePath}';`);
    importMap[path] = importName;
  });
  
  // Generate project objects
  const projectsArray = projects.map(project => {
    const imageRef = typeof project.image === 'string' && project.image.startsWith('/')
      ? importMap[project.image]
      : (typeof project.image === 'string' ? JSON.stringify(project.image) : 'null');
    
    const lines = [
      `    id: ${JSON.stringify(project.id)},`,
      `    title: ${JSON.stringify(project.title)},`,
      `    description: ${JSON.stringify(project.description)},`,
      `    longDescription: ${JSON.stringify(project.longDescription)},`,
      `    image: ${imageRef},`,
      `    technologies: ${JSON.stringify(project.technologies)},`,
      project.date ? `    date: ${JSON.stringify(project.date)},` : '',
      project.githubUrl ? `    githubUrl: ${JSON.stringify(project.githubUrl)},` : '',
      project.liveUrl ? `    liveUrl: ${JSON.stringify(project.liveUrl)},` : '',
      `    category: ${JSON.stringify(project.category)},`,
      `    featured: ${project.featured}`
    ].filter(Boolean);
    
    return `  {\n${lines.join('\n')}\n  }`;
  }).join(',\n');
  
  const content = `${imports.join('\n')}

export const projectData: ProjectDetails[] = [
${projectsArray}
];

// Helper function to get featured projects
export const getFeaturedProjects = () => projectData.filter(project => project.featured);

// Helper function to get project by ID
export const getProjectById = (id: string) => projectData.find(project => project.id === id);

// Helper function to get projects by category
export const getProjectsByCategory = (category: string) => 
  projectData.filter(project => project.category === category);
`;
  
  await fs.writeFile(PROJECT_DATA_FILE, content, 'utf8');
}

// Handle image upload
export async function saveImage(file: File, filename: string): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const filePath = join(PUBLIC_DIR, filename);
  await fs.writeFile(filePath, buffer);
  return `/${filename}`;
}

