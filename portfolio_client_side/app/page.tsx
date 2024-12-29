import React from 'react'
import Hero from './HomePages/Hero';
import ProjectsPreview from './HomePages/ProjectsPreview';
import BlogPreview from './HomePages/BlogPreview';
import MarketplacePreview from './HomePages/MarketplacePreview';

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      <Hero />
      <ProjectsPreview />
      <BlogPreview />
      <MarketplacePreview />
    </main>
  );
}
