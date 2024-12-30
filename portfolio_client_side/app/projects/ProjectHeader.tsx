'use client'

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Github, ExternalLink, Calendar, Tag } from 'lucide-react';
import { ProjectDetails } from './project';

interface ProjectHeaderProps {
  project: ProjectDetails;
}

export const ProjectHeader: React.FC<ProjectHeaderProps> = ({ project }) => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <header className="max-w-4xl mx-auto px-4 py-8">
      <nav className="mb-8">
        <Link 
          href="/projects" 
          className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Projects
        </Link>
      </nav>

      <motion.div {...fadeInUp} className="space-y-6">
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

        {/* Technology Tags */}
        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech: { name: string}, index: React.Key | null | undefined) => (
            <span
              key={index}
              className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm"
            >
              {tech.name}
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-gray-900 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Github className="w-4 h-4 mr-2" />
              View Code
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Live Demo
            </a>
          )}
        </div>
      </motion.div>
    </header>
  );
};