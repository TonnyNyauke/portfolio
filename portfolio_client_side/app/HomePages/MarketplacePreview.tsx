'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion';
import Link from 'next/link';

function MarketplacePreview() {
  return (
    <section className="py-20 bg-white dark:bg-gray-800">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl font-bold mb-12 text-center">Featured Templates</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map((template) => (
          <motion.div
            key={template}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-50 dark:bg-gray-700 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="relative h-48">
              <Image
                src={`/api/placeholder/400/300`}
                alt="Template preview"
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">Template {template}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Professional template for modern web applications.
              </p>
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg">$49</span>
                <Link href={`/marketplace/${template}`} className="text-blue-600 hover:text-blue-700">
                  View Details →
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="text-center mt-12">
        <Link href="/marketplace" className="text-blue-600 hover:text-blue-700 font-semibold">
          View All Templates →
        </Link>
      </div>
    </div>
  </section>
);
}

export default MarketplacePreview