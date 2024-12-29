'use client'

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Github, ExternalLink, Calendar, Tag } from 'lucide-react';
import { ProjectDetails } from './project';

interface ProjectHeaderProps {
  project: ProjectDetails;
}

export const ProjectHeader: React.FC<ProjectHeaderProps> = ({ project }) => (
  <div className="max-w-4xl mx-auto px-4 py-8">
    <Link href="/projects" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8">
      <ArrowLeft className="w-4 h-4 mr-2" />
      Back to Projects
    </Link>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-4xl md:text-5xl font-bold mb-4">{project.title}</h1>
      <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">{project.description}</p>
      <div className="flex flex-wrap gap-4 mb-8">
        <div className="flex items-center text-gray-600 dark:text-gray-300">
          <Calendar className="w-4 h-4 mr-2" />
          {project.date}
        </div>
        <div className="flex items-center text-gray-600 dark:text-gray-300">
          <Tag className="w-4 h-4 mr-2" />
          {project.category}
        </div>
      </div>
      <div className="flex gap-4">
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
  </div>
);