'use client'

import { motion } from 'framer-motion';
import Link from 'next/link';
import React from 'react'
import Image from 'next/image'

function ProjectsPreview() {
  return (
    <section className="py-20 bg-white dark:bg-gray-800">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl font-bold mb-12 text-center">Featured Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map((project) => (
          <motion.div
            key={project}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-50 dark:bg-gray-700 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="relative h-48">
              <Image
                src={`/api/placeholder/400/300`}
                alt="Project preview"
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Project {project}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Brief description of the project goes here. Highlighting key features and technologies used.
              </p>
              <Link href={`/projects/${project}`} className="text-blue-600 hover:text-blue-700">
                Learn More →
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="text-center mt-12">
        <Link href="/projects" className="text-blue-600 hover:text-blue-700 font-semibold">
          View All Projects →
        </Link>
      </div>
    </div>
  </section>
);
}

export default ProjectsPreview