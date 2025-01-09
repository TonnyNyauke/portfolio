// app/projects/[id]/page.tsx
import React from 'react';
import { notFound } from 'next/navigation';
import { getProjectById } from '../projectData';
import { ProjectHeader } from '../ProjectHeader';
import { ProjectContent } from '../ProjectContent';


export default function ProjectDetails({ params }) {
  const project = getProjectById(params.id);
  
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