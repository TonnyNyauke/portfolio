// app/projects/[id]/page.tsx
import React from 'react';

import { notFound } from 'next/navigation';
import { getFeaturedProjects } from './projectData';
import { Calendar, Tag } from 'lucide-react';
import Link from 'next/link';


interface Props {
  params: {
    id: string;
  }
}

export default function ProjectDetails({ params }: Props) {
  const project = getFeaturedProjects()
  
  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      {project.map(project => (
        <div key={project.id}>
            {/* Project Title and Description */}
            <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{project.title}</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">{project.description}</p>
            </div>
            {/* Project Metadata */}
            <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center text-gray-600 dark:text-gray-300">
                <Calendar className="w-4 h-4 mr-2" />
                {project.date}
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-300">
                <Tag className="w-4 h-4 mr-2" />
                {project.category}
            </div>
            {project.featured && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                Featured Project
                </span>
            )}
            </div>
            <Link href={`/projects/${project.id}`} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">View</Link>
        </div>
      ))}
    </main>
  );
}