// app/projects/[id]/page.tsx
import React from 'react';
import { notFound } from 'next/navigation';
import { getProjectById } from '@/lib/db/projects';
import { ProjectHeader } from '../ProjectHeader';
import { ProjectContent } from '../ProjectContent';

interface ProjectDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetails({ params }: ProjectDetailsPageProps) {
  const { id } = await params;
  const project = await getProjectById(id);
  
  if (!project) {
    notFound();
  }

  return (
    <div>
      <ProjectHeader project={project} />
      <ProjectContent project={project} />
    </div>
  );
}