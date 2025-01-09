'use client'

import React from 'react'
import Link from 'next/link';
import { motion } from 'framer-motion';

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
};

const stats = [
  { label: 'Years Experience', value: '2+' },
  { label: 'Projects Completed', value: '5+' },
  { label: 'Industries Served', value: '3' },
];

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <motion.div
            {...fadeInUp}
            className="mb-8 relative"
          >
          </motion.div>

          <motion.span
            {...fadeInUp}
            className="text-lg md:text-xl text-blue-600 dark:text-blue-400 font-medium mb-4 block"
          >
            Hi, I'm Tonny Nyauke 👋
          </motion.span>
          
          <motion.h1 
            {...fadeInUp}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500"
          >
            Building Modern Web Solutions with Next.js
          </motion.h1>
          
          <motion.p 
            {...fadeInUp}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto"
          >
            Fullstack developer specializing in e-commerce platforms, educational solutions, 
            and business intelligence tools. Transforming ideas into scalable applications 
            with modern web technologies.
          </motion.p>

          <motion.div
            {...fadeInUp}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-3 max-w-lg mx-auto gap-8 mb-12"
          >
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div 
            {...fadeInUp}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap gap-4 justify-center mb-8"
          >
            <Link 
              href="/projects" 
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              View Projects
            </Link>
            <Link 
              href="/contact" 
              className="px-8 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
            >
              Let's Connect
            </Link>
          </motion.div>

          <motion.div
            {...fadeInUp}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              Expertise In
            </h3>
            <div className="flex flex-wrap gap-4 justify-center">
              <span className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                E-commerce Solutions
              </span>
              <span className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm">
                Educational Platforms
              </span>
              <span className="px-4 py-2 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-full text-sm">
                Business Intelligence
              </span>
            </div>
          </motion.div>

          <motion.div
            {...fadeInUp}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-wrap gap-4 justify-center mt-8 text-sm text-gray-600 dark:text-gray-400"
          >
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Next.js
            </span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              TypeScript
            </span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              Node.js
            </span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
              Tailwind CSS
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  )
}