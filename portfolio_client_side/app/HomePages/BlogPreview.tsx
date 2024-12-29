'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import React from 'react'

function BlogPreview() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl font-bold mb-12 text-center">Latest Articles</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {[1, 2].map((post) => (
          <motion.article
            key={post}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="p-6">
              <span className="text-blue-600 text-sm font-semibold">Techpreneurship</span>
              <h3 className="text-xl font-semibold mt-2 mb-3">How to Build a Successful SaaS Product</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Insights and lessons learned from building and scaling SaaS products...
              </p>
              <Link href="/blog/post-1" className="text-blue-600 hover:text-blue-700">
                Read More →
              </Link>
            </div>
          </motion.article>
        ))}
      </div>
      <div className="text-center mt-12">
        <Link href="/blog" className="text-blue-600 hover:text-blue-700 font-semibold">
          View All Articles →
        </Link>
      </div>
    </div>
  </section>
  )
}

export default BlogPreview