import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ProjectDetails } from './project';

interface ProjectContentProps {
  project: ProjectDetails;
}

export const ProjectContent: React.FC<ProjectContentProps> = ({ project }) => {
  // Convert project long description to paragraphs
  const descriptionParagraphs = project.longDescription.split('\n\n');

  return (
    <article className="max-w-4xl mx-auto px-4 py-12">
      {/* Project Image */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-12"
      >
        <div className="relative h-[400px] md:h-[500px] rounded-xl overflow-hidden mb-12 shadow-lg">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover transition-transform hover:scale-105 duration-300"
            priority
          />
        </div>
      </motion.div>

      {/* Project Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="prose dark:prose-invert max-w-none"
      >
        <div className="space-y-8">
          {descriptionParagraphs.map((paragraph: any, index: React.Key | null | undefined) => {
            // Check if the paragraph is a list of features or technical details
            if (paragraph.includes('Key Features:') || 
                paragraph.includes('Technical Challenges:') ||
                paragraph.includes('Implementation Details:') ||
                paragraph.includes('Technical Implementation:') ||
                paragraph.includes('Technical Highlights:')) {
              const [title, ...items] = paragraph.split('\n');
              return (
                <div key={index} className="space-y-4">
                  <h2 className="text-2xl font-bold">{title}</h2>
                  <ul className="list-disc pl-6 space-y-2">
                    {items.map((item: string, itemIndex: React.Key | null | undefined) => (
                      <li key={itemIndex} className="text-gray-600 dark:text-gray-300">
                        {item.replace('• ', '')}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            }
            // Regular paragraph
            return (
              <p key={index} className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {paragraph}
              </p>
            );
          })}
        </div>
      </motion.div>

      {/* Technical Stack Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="mt-12 pt-12 border-t border-gray-200 dark:border-gray-700"
      >
        <h2 className="text-2xl font-bold mb-6">Technical Stack</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {project.technologies.map((tech: any, index: React.Key | null | undefined) => (
            <div
              key={index}
              className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center"
            >
              {tech.icon && <span className="block text-2xl mb-2">{tech.icon}</span>}
              <span className="text-sm font-medium">{tech.name}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </article>
  );
};