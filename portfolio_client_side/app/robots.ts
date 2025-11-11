// app/robots.ts
import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        // Allow all routes including dynamic routes (/thoughts/[id], /projects/[id], /adventures/[id])
        allow: '/',
        // Disallow API routes, admin panel, Next.js internals, and private routes
        disallow: ['/api/', '/admin/', '/_next/', '/private/'],
      },
    ],
    sitemap: 'https://www.tonnynyauke.com/sitemap.xml',
  }
}