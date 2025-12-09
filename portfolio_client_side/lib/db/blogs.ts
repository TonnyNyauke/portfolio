import { supabase } from '@/lib/supabase'
import type { Blog } from '@/app/api/admin/blogs/route'

// Convert database row to Blog type
function dbToBlog(row: any): Blog {
  return {
    id: row.id,
    title: row.title,
    category: row.category as Blog['category'],
    excerpt: row.excerpt,
    content: row.content,
    created_at: row.created_at,
    readTime: row.read_time,
    tags: row.tags || [],
    featured: row.featured,
    views: row.views || 0,
    file_url: row.file_url || undefined,
  }
}

// Convert Blog type to database insert format
function blogToDb(blog: Partial<Blog>): any {
  return {
    id: blog.id,
    title: blog.title,
    category: blog.category || null,
    excerpt: blog.excerpt || '',
    content: blog.content || '',
    created_at: blog.created_at || new Date().toISOString().split('T')[0],
    read_time: blog.readTime || '5 min read',
    tags: blog.tags || [],
    featured: blog.featured ?? false,
    views: blog.views || 0,
    file_url: blog.file_url || null,
  }
}

export async function getAllBlogs(filters?: {
  category?: string
  exclude?: string
  limit?: number
}): Promise<Blog[]> {
  let query = supabase.from('blogs').select('*')

  if (filters?.category) {
    query = query.eq('category', filters.category)
  }

  if (filters?.exclude) {
    query = query.neq('id', filters.exclude)
  }

  query = query.order('created_at', { ascending: false })

  if (filters?.limit && filters.limit > 0) {
    query = query.limit(filters.limit)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching blogs:', error)
    throw new Error(`Failed to fetch blogs: ${error.message}`)
  }

  return (data || []).map(dbToBlog)
}

export async function getBlogById(id: string): Promise<Blog | null> {
  const { data, error } = await supabase.from('blogs').select('*').eq('id', id).single()

  if (error) {
    if (error.code === 'PGRST116') {
      // Not found
      return null
    }
    console.error('Error fetching blog:', error)
    throw new Error(`Failed to fetch blog: ${error.message}`)
  }

  return data ? dbToBlog(data) : null
}

export async function createBlog(blog: Partial<Blog>): Promise<Blog> {
  const blogData = blogToDb({
    ...blog,
    id: blog.id || `${Date.now()}`,
  })

  const { data, error } = await supabase.from('blogs').insert(blogData).select().single()

  if (error) {
    console.error('Error creating blog:', error)
    throw new Error(`Failed to create blog: ${error.message}`)
  }

  return dbToBlog(data)
}

export async function updateBlog(id: string, updates: Partial<Blog>): Promise<Blog> {
  const updateData: any = {}
  
  if (updates.title !== undefined) updateData.title = updates.title
  if (updates.category !== undefined) updateData.category = updates.category
  if (updates.excerpt !== undefined) updateData.excerpt = updates.excerpt
  if (updates.content !== undefined) updateData.content = updates.content
  if (updates.created_at !== undefined) updateData.created_at = updates.created_at as string
  if (updates.readTime !== undefined) updateData.read_time = updates.readTime
  if (updates.tags !== undefined) updateData.tags = updates.tags
  if (updates.featured !== undefined) updateData.featured = updates.featured
  if (updates.views !== undefined) updateData.views = updates.views
  if (updates.file_url !== undefined) updateData.file_url = updates.file_url

  const { data, error } = await supabase
    .from('blogs')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating blog:', error)
    throw new Error(`Failed to update blog: ${error.message}`)
  }

  if (!data) {
    throw new Error('Blog not found')
  }

  return dbToBlog(data)
}

export async function deleteBlog(id: string): Promise<void> {
  const { error } = await supabase.from('blogs').delete().eq('id', id)

  if (error) {
    console.error('Error deleting blog:', error)
    throw new Error(`Failed to delete blog: ${error.message}`)
  }
}

