import React from 'react';
import { projectData } from './projectData';
import { ProjectHeader } from './ProjectHeader';
import { ProjectContent } from './ProjectContent';

export default function ProjectDetails() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      <ProjectHeader project={projectData} />
      <ProjectContent project={projectData} />
    </main>
  );
}