// app/sitemap.ts
import { MetadataRoute } from 'next'
import { readJsonFile } from '@/lib/fileStore'
import { projectData } from '@/app/projects/projectData'
import type { Blog } from '@/app/api/admin/blogs/route'
import type { Adventure } from '@/app/api/admin/adventures/route'
 
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.tonnynyauke.com'
  
  // Static routes
  const staticRoutes = [
    '',
    '/about',
    '/thoughts',
    '/adventures',
    '/reading',
    '/contact',
    '/projects',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Dynamic routes - fetch blogs (thoughts)
  let blogRoutes: MetadataRoute.Sitemap = []
  try {
    const blogs = await readJsonFile<Blog[]>('blogs.json', [])
    blogRoutes = blogs.map((blog) => ({
      url: `${baseUrl}/thoughts/${blog.id}`,
      lastModified: new Date(blog.date).toISOString(),
      changeFrequency: 'monthly' as const,
      priority: blog.featured ? 0.9 : 0.7,
    }))
  } catch (error) {
    console.error('Error fetching blogs for sitemap:', error)
  }

  // Dynamic routes - fetch projects
  const projectRoutes = projectData.map((project) => ({
    url: `${baseUrl}/projects/${project.id}`,
    lastModified: project.date ? new Date(project.date).toISOString() : new Date().toISOString(),
    changeFrequency: 'monthly' as const,
    priority: project.featured ? 0.9 : 0.7,
  }))

  // Dynamic routes - fetch adventures
  let adventureRoutes: MetadataRoute.Sitemap = []
  try {
    const adventures = await readJsonFile<Adventure[]>('adventures.json', [])
    adventureRoutes = adventures.map((adventure) => ({
      url: `${baseUrl}/adventures/${adventure.id}`,
      lastModified: new Date(adventure.date).toISOString(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  } catch (error) {
    console.error('Error fetching adventures for sitemap:', error)
  }

  return [...staticRoutes, ...blogRoutes, ...projectRoutes, ...adventureRoutes]
}