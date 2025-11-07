// app/sitemap.ts
import { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.tonnynyauke.com'
  
  // Add your dynamic routes here if you have blog posts, projects, etc.
  const routes = [
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

  return routes
}