'use client'

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ProjectDetails } from './project';

interface ProjectContentProps {
  project: ProjectDetails;
}

export const ProjectContent: React.FC<ProjectContentProps> = ({ project }) => (
  <div className="max-w-4xl mx-auto px-4 py-12">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="mb-12"
    >
      <div className="relative h-[400px] md:h-[500px] rounded-xl overflow-hidden mb-12">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover transition-transform hover:scale-105"
        />
      </div>
      <div className="prose dark:prose-invert max-w-none">
        <h2 className="text-2xl font-bold mb-4">About the Project</h2>
        <p className="text-gray-600 dark:text-gray-300">{project.longDescription}</p>
      </div>
    </motion.div>
    
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <h2 className="text-2xl font-bold mb-6">Technologies Used</h2>
      <div className="flex flex-wrap gap-3">
        {project.technologies.map((tech: { name: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }, index: React.Key | null | undefined) => (
          <span
            key={index}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full text-sm"
          >
            {tech.name}
          </span>
        ))}
      </div>
    </motion.div>
  </div>
);