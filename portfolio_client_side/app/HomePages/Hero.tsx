'use client'

import React from 'react'
import Link from 'next/link';
import { motion } from 'framer-motion';

// Animation variants for consistent use
const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
    <div className="container mx-auto px-4 py-16">
      <div className="text-center">
        <motion.h1 
          {...fadeInUp}
          className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500"
        >
          Fullstack Developer & Tech Entrepreneur
        </motion.h1>
        <motion.p 
          {...fadeInUp}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto"
        >
          Crafting digital solutions and building innovative SaaS products
        </motion.p>
        <motion.div 
          {...fadeInUp}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex gap-4 justify-center"
        >
          <Link href="/projects" className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            View Projects
          </Link>
          <Link href="/blog" className="px-8 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
            Read Blog
          </Link>
        </motion.div>
      </div>
    </div>
  </section>
  )
}