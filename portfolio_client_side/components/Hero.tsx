// app/components/Hero.tsx
'use client'

import { motion } from 'framer-motion'
import { Code, BookOpen, Heart, Zap } from 'lucide-react'
import Link from 'next/link'

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: "easeOut" }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <div className="container mx-auto px-6 py-20">
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div
            variants={fadeInUp}
            className="mb-8"
          >
            <div className="relative w-32 h-32 mx-auto mb-6">
              <div className="w-full h-full rounded-full overflow-hidden shadow-2xl ring-4 ring-white/50 dark:ring-slate-700/50">
                <img
                  src="/profile.png"
                  alt="Tonny Nyauke"
                  className="w-full h-full object-cover"
                />
                {/* Fallback with initials if image fails to load */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold opacity-0 hover:opacity-100 transition-opacity">
                  TN
                </div>
              </div>
              {/* Online status indicator */}
              <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white dark:border-slate-800 shadow-lg">
                <div className="w-full h-full bg-green-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </motion.div>

          <motion.h1 
            variants={fadeInUp}
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-slate-800 via-blue-700 to-indigo-700 dark:from-slate-200 dark:via-blue-300 dark:to-indigo-300 bg-clip-text text-transparent"
          >
            Hey, I'm Tonny
          </motion.h1>
          
          <motion.p 
            variants={fadeInUp}
            className="text-xl md:text-2xl text-slate-700 dark:text-slate-300 mb-8 leading-relaxed"
          >
            I build things with code, grow SaaS businesses, and find wisdom in good books.
            <br />
            <span className="text-lg opacity-90">
              Currently crafting <strong className="text-blue-700 dark:text-blue-400">Zuriscale</strong> and exploring how technology serves people better.
            </span>
          </motion.p>

          <motion.div 
            variants={fadeInUp}
            className="flex flex-wrap justify-center gap-6 mb-12"
          >
            <div className="flex items-center gap-3 px-4 py-3 bg-white/80 dark:bg-slate-800/80 rounded-full shadow-md backdrop-blur-sm">
              <Code className="w-5 h-5 text-blue-600" />
              <span className="text-slate-700 dark:text-slate-300 font-medium">Building SaaS</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 bg-white/80 dark:bg-slate-800/80 rounded-full shadow-md backdrop-blur-sm">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <span className="text-slate-700 dark:text-slate-300 font-medium">Reading & Learning</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 bg-white/80 dark:bg-slate-800/80 rounded-full shadow-md backdrop-blur-sm">
              <Heart className="w-5 h-5 text-rose-600" />
              <span className="text-slate-700 dark:text-slate-300 font-medium">Faith & Purpose</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 bg-white/80 dark:bg-slate-800/80 rounded-full shadow-md backdrop-blur-sm">
              <Zap className="w-5 h-5 text-amber-600" />
              <span className="text-slate-700 dark:text-slate-300 font-medium">Customer Experience</span>
            </div>
          </motion.div>

          <motion.div 
            variants={fadeInUp}
            className="text-center"
          >
            <p className="text-slate-600 dark:text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
              This is where I share what I'm building, what I'm learning, and the ideas that excite me. 
              Think of it as coffee with someone who's passionate about technology, business, and making things that matter.
            </p>
            
            <Link href='/contact'>
              <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                Let&apos;s Connect
              </button>
            </Link>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="mt-16 flex justify-center space-x-8 text-sm text-slate-500 dark:text-slate-400"
          >
            <span>🚀 Building in Homa Bay</span>
            <span>📚 Always Learning</span>
            <span>✨ SDA Christian</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}