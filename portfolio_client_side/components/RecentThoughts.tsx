'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, ArrowRight, MessageSquare, Heart, Code } from 'lucide-react'
import Link from 'next/link'
import { Blog } from '@/app/api/admin/blogs/route'

// Category icon mapping
const categoryIcons: { [key: string]: any } = {
  'business': Code,
  'personal': Heart,
  'tech': Code,
  'default': MessageSquare
}

// Category color mapping
const categoryColors: { [key: string]: string } = {
  'business': 'from-blue-500 to-blue-600',
  'personal': 'from-pink-500 to-pink-600',
  'tech': 'from-purple-500 to-purple-600',
  'default': 'from-slate-500 to-slate-600'
}

// Function to convert date to relative time
const getRelativeTime = (dateString: string): string => {
  // Handle special cases
  if (dateString === 'currently-reading') return 'Currently reading'
  
  const date = new Date(dateString)
  
  // Check for invalid date
  if (isNaN(date.getTime())) return dateString
  
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  // Future dates
  if (diffInSeconds < 0) return dateString
  
  // Less than a minute
  if (diffInSeconds < 60) return 'Just now'
  
  // Minutes
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`
  }
  
  // Hours
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`
  }
  
  // Days
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 30) {
    return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`
  }
  
  // Months
  const diffInMonths = Math.floor(diffInDays / 30)
  if (diffInMonths < 12) {
    return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`
  }
  
  // Years
  const diffInYears = Math.floor(diffInMonths / 12)
  return `${diffInYears} ${diffInYears === 1 ? 'year' : 'years'} ago`
}

export default function RecentThoughts() {
  const [myThoughts, setMyThoughts] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // Fetch blogs from API
  useEffect(() => {
    async function fetchThoughts() {
      try {
        const res = await fetch('/api/admin/blogs', { cache: 'no-store' })
        const data = await res.json()
        setMyThoughts(data.blogs || [])
      } catch (error) {
        console.error('Error fetching blogs:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchThoughts()
  }, [])

  // Sort blogs by date (newest first) and filter by category
  const getSortedAndFilteredThoughts = () => {
    let filtered = myThoughts
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = myThoughts.filter(
        thought => thought.category?.toLowerCase() === selectedCategory.toLowerCase()
      )
    }
    
    // Sort by date (newest first)
    return filtered.sort((a, b) => {
      // Handle special cases
      if (a.date === 'currently-reading') return -1
      if (b.date === 'currently-reading') return 1
      
      // Parse dates and sort
      const dateA = new Date(a.date)
      const dateB = new Date(b.date)
      
      // Check for invalid dates
      if (isNaN(dateA.getTime())) return 1
      if (isNaN(dateB.getTime())) return -1
      
      return dateB.getTime() - dateA.getTime()
    })
  }

  const sortedThoughts = getSortedAndFilteredThoughts()
  // Show only the 3 most recent thoughts
  const recentThoughts = sortedThoughts.slice(0, 3)

  if (loading) {
    return (
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded w-64 mx-auto mb-4"></div>
              <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-96 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold mb-4 text-slate-800 dark:text-slate-200"
          >
            Recent Thoughts
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto"
          >
            Discoveries, lessons, and ideas from my journey
          </motion.p>
        </div>

        {recentThoughts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              No thoughts shared yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-8">
            {recentThoughts.map((thought, index) => {
              const IconComponent = categoryIcons[thought.category?.toLowerCase() || 'default'] || categoryIcons.default
              const colorClass = categoryColors[thought.category?.toLowerCase() || 'default'] || categoryColors.default
              
              return (
                <motion.article
                  key={thought.id || index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 dark:border-slate-700 cursor-pointer"
                >
                  <div className="flex items-start gap-6">
                    <div className={`flex-shrink-0 p-3 rounded-xl bg-gradient-to-br ${colorClass} shadow-lg`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3 flex-wrap">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r ${colorClass} text-white`}>
                          {thought.category}
                        </span>
                        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                          <Calendar className="w-4 h-4" />
                          <span>{getRelativeTime(thought.date)}</span>
                          {thought.readTime && (
                            <>
                              <span>•</span>
                              <span>{thought.readTime}</span>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <h3 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {thought.title}
                      </h3>
                      
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                        {thought.excerpt || thought.excerpt}
                      </p>
                      
                      <Link 
                        href={`/thoughts/${thought.id}`} 
                        className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold group-hover:gap-3 transition-all duration-300"
                      >
                        <span>Read more</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              )
            })}
          </div>
        )}

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link href='/thoughts'>
            <button className="px-8 py-4 bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-800 rounded-full font-semibold hover:bg-slate-700 dark:hover:bg-slate-300 transition-colors shadow-lg hover:shadow-xl transition-shadow">
              View All Thoughts
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}