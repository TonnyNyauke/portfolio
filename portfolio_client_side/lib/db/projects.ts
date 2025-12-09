import { supabase } from '@/lib/supabase'
import type { ProjectDetails } from '@/app/projects/project'

// Convert database row to ProjectDetails type
function dbToProject(row: any): ProjectDetails {
  return {
    id: row.id,
    title: row.title,
    description: row.description || '',
    longDescription: row.long_description || '',
    image: row.image || '',
    technologies: row.technologies || [],
    date: row.date || undefined,
    githubUrl: row.github_url || undefined,
    liveUrl: row.live_url || undefined,
    category: row.category || 'General',
    featured: row.featured ?? false,
  }
}

// Convert ProjectDetails type to database insert format
function projectToDb(project: Partial<ProjectDetails>): any {
  return {
    id: project.id,
    title: project.title,
    description: project.description || '',
    long_description: project.longDescription || '',
    image: project.image || null,
    technologies: project.technologies || [],
    date: project.date || null,
    github_url: project.githubUrl || null,
    live_url: project.liveUrl || null,
    category: project.category || 'General',
    featured: project.featured ?? false,
  }
}

export async function getAllProjects(filters?: {
  category?: string
  exclude?: string
  limit?: number
  featured?: boolean
}): Promise<ProjectDetails[]> {
  let query = supabase.from('projects').select('*')

  if (filters?.category) {
    query = query.eq('category', filters.category)
  }

  if (filters?.exclude) {
    query = query.neq('id', filters.exclude)
  }

  if (filters?.featured !== undefined) {
    query = query.eq('featured', filters.featured)
  }

  query = query.order('date', { ascending: false, nullsFirst: false })

  if (filters?.limit && filters.limit > 0) {
    query = query.limit(filters.limit)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching projects:', error)
    throw new Error(`Failed to fetch projects: ${error.message}`)
  }

  return (data || []).map(dbToProject)
}

export async function getProjectById(id: string): Promise<ProjectDetails | null> {
  const { data, error } = await supabase.from('projects').select('*').eq('id', id).single()

  if (error) {
    if (error.code === 'PGRST116') {
      // Not found
      return null
    }
    console.error('Error fetching project:', error)
    throw new Error(`Failed to fetch project: ${error.message}`)
  }

  return data ? dbToProject(data) : null
}

export async function createProject(project: Partial<ProjectDetails>): Promise<ProjectDetails> {
  const projectData = projectToDb({
    ...project,
    id: project.id || `${Date.now()}`,
  })

  const { data, error } = await supabase.from('projects').insert(projectData).select().single()

  if (error) {
    console.error('Error creating project:', error)
    throw new Error(`Failed to create project: ${error.message}`)
  }

  return dbToProject(data)
}

export async function updateProject(id: string, updates: Partial<ProjectDetails>): Promise<ProjectDetails> {
  const updateData: any = {}
  
  if (updates.title !== undefined) updateData.title = updates.title
  if (updates.description !== undefined) updateData.description = updates.description
  if (updates.longDescription !== undefined) updateData.long_description = updates.longDescription
  if (updates.image !== undefined) updateData.image = updates.image
  if (updates.technologies !== undefined) updateData.technologies = updates.technologies
  if (updates.date !== undefined) updateData.date = updates.date
  if (updates.githubUrl !== undefined) updateData.github_url = updates.githubUrl
  if (updates.liveUrl !== undefined) updateData.live_url = updates.liveUrl
  if (updates.category !== undefined) updateData.category = updates.category
  if (updates.featured !== undefined) updateData.featured = updates.featured

  const { data, error } = await supabase
    .from('projects')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating project:', error)
    throw new Error(`Failed to update project: ${error.message}`)
  }

  if (!data) {
    throw new Error('Project not found')
  }

  return dbToProject(data)
}

export async function deleteProject(id: string): Promise<void> {
  const { error } = await supabase.from('projects').delete().eq('id', id)

  if (error) {
    console.error('Error deleting project:', error)
    throw new Error(`Failed to delete project: ${error.message}`)
  }
}

