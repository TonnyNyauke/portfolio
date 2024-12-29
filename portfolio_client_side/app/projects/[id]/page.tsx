// app/projects/[id]/page.tsx
import React from 'react';

import { notFound } from 'next/navigation';
import { getProjectById } from '../projectData';
import { ProjectHeader } from '../ProjectHeader';
import { ProjectContent } from '../ProjectContent';

interface Props {
  params: {
    id: string;
  }
}

export default function ProjectDetails({ params }: Props) {
  const project = getProjectById(params.id);
  
  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      <ProjectHeader project={project} />
      <ProjectContent project={project} />
    </main>
  );
}