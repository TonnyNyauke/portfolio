// app/adventures/page.tsx
'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Camera, Users, MessageCircle, Compass, Heart, Search, Calendar, Filter } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface Adventure {
  id: string
  title: string
  subtitle: string
  description: string
  content: string
  date: string
  type: 'Experience' | 'Community' | 'Travel'
  color: string
  icon: string
  images: string[]
  location?: string
  status?: 'ongoing' | 'completed'
}

const typeIcons: { [key: string]: any } = {
  'Experience': Heart,
  'Community': Users,
  'Travel': Compass
}

const typeColors: { [key: string]: string } = {
  'Experience': 'from-rose-500 to-pink-600',
  'Community': 'from-blue-500 to-indigo-600',
  'Travel': 'from-emerald-500 to-teal-600'
}

// Function to convert date to relative time
const getRelativeTime = (dateString: string): string => {
  if (dateString === 'ongoing') return 'Ongoing'
  
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return dateString
  
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 0) return dateString
  if (diffInSeconds < 60) return 'Just now'
  
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 30) return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`
  
  const diffInMonths = Math.floor(diffInDays / 30)
  if (diffInMonths < 12) return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`
  
  const diffInYears = Math.floor(diffInMonths / 12)
  return `${diffInYears} ${diffInYears === 1 ? 'year' : 'years'} ago`
}

export default function AdventuresPage() {
  const [adventures, setAdventures] = useState<Adventure[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [dateFilter, setDateFilter] = useState<string>('all')

  useEffect(() => {
    async function fetchAdventures() {
      try {
        const res = await fetch('/api/adventures', { cache: 'no-store' })
        const data = await res.json()
        setAdventures(data.adventures || [])
      } catch (error) {
        console.error('Error fetching adventures:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchAdventures()
  }, [])

  // Filter and sort adventures
  const getFilteredAdventures = () => {
    let filtered = adventures

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(adventure => 
        adventure.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        adventure.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        adventure.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(adventure => adventure.type === selectedType)
    }

    // Filter by date range
    if (dateFilter !== 'all') {
      const now = new Date()
      filtered = filtered.filter(adventure => {
        if (adventure.status === 'ongoing') return dateFilter === 'ongoing'
        
        const adventureDate = new Date(adventure.date)
        if (isNaN(adventureDate.getTime())) return false

        const diffInDays = Math.floor((now.getTime() - adventureDate.getTime()) / (1000 * 60 * 60 * 24))
        
        if (dateFilter === 'week') return diffInDays <= 7
        if (dateFilter === 'month') return diffInDays <= 30
        if (dateFilter === 'year') return diffInDays <= 365
        return true
      })
    }

    // Sort by date (most recent first)
    return filtered.sort((a, b) => {
      if (a.status === 'ongoing') return -1
      if (b.status === 'ongoing') return 1
      
      const dateA = new Date(a.date)
      const dateB = new Date(b.date)
      
      if (isNaN(dateA.getTime())) return 1
      if (isNaN(dateB.getTime())) return -1
      
      return dateB.getTime() - dateA.getTime()
    })
  }

  const filteredAdventures = getFilteredAdventures()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 py-32">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="animate-pulse space-y-4">
              <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded w-96 mx-auto"></div>
              <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-128 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      {/* Hero Section */}
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-800 via-blue-700 to-indigo-700 dark:from-slate-200 dark:via-blue-300 dark:to-indigo-300 bg-clip-text text-transparent">
              Adventures & Experiences
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Beyond code and books—exploring life, business, and meaningful connections
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="pb-12">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search adventures..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Type Filter */}
                <div className="relative">
                  <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none"
                  >
                    <option value="all">All Types</option>
                    <option value="Experience">Experience</option>
                    <option value="Community">Community</option>
                    <option value="Travel">Travel</option>
                  </select>
                </div>

                {/* Date Filter */}
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none"
                  >
                    <option value="all">All Time</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="week">Past Week</option>
                    <option value="month">Past Month</option>
                    <option value="year">Past Year</option>
                  </select>
                </div>
              </div>

              {/* Active Filters Display */}
              {(searchQuery || selectedType !== 'all' || dateFilter !== 'all') && (
                <div className="mt-4 flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Active filters:</span>
                  {searchQuery && (
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                      Search: {searchQuery}
                    </span>
                  )}
                  {selectedType !== 'all' && (
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                      Type: {selectedType}
                    </span>
                  )}
                  {dateFilter !== 'all' && (
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                      Date: {dateFilter}
                    </span>
                  )}
                  <button
                    onClick={() => {
                      setSearchQuery('')
                      setSelectedType('all')
                      setDateFilter('all')
                    }}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Adventures Grid */}
      <section className="pb-20">
        <div className="container mx-auto px-6">
          {filteredAdventures.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 dark:text-slate-400 text-lg">
                No adventures found. Try adjusting your filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {filteredAdventures.map((adventure, index) => {
                const IconComponent = typeIcons[adventure.type] || MessageCircle
                const colorClass = typeColors[adventure.type] || 'from-slate-500 to-slate-600'

                return (
                  <motion.article
                    key={adventure.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Link href={`/adventures/${adventure.id}`}>
                      <div className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 dark:border-slate-700 h-full flex flex-col">
                        {/* Image */}
                        {adventure.images && adventure.images.length > 0 && (
                          <div className="relative h-48 w-full overflow-hidden">
                            <Image
                              src={adventure.images[0]}
                              alt={adventure.title}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            {adventure.status === 'ongoing' && (
                              <div className="absolute top-4 right-4 px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                                Ongoing
                              </div>
                            )}
                          </div>
                        )}

                        {/* Content */}
                        <div className="p-6 flex-1 flex flex-col">
                          <div className="flex items-center justify-between mb-4">
                            <div className={`p-2 rounded-lg bg-gradient-to-br ${colorClass}`}>
                              <IconComponent className="w-5 h-5 text-white" />
                            </div>
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r ${colorClass} text-white`}>
                              {adventure.type}
                            </span>
                          </div>

                          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {adventure.title}
                          </h3>
                          
                          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3">
                            {adventure.subtitle}
                          </p>

                          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4 flex-1 line-clamp-3">
                            {adventure.description}
                          </p>

                          <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 pt-4 border-t border-slate-200 dark:border-slate-700">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>{getRelativeTime(adventure.date)}</span>
                            </div>
                            {adventure.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                <span>{adventure.location}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="pb-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-12"
          >
            <div className="flex items-center justify-center gap-2 mb-6">
              <Camera className="w-6 h-6 text-blue-600" />
              <MapPin className="w-6 h-6 text-emerald-600" />
              <MessageCircle className="w-6 h-6 text-purple-600" />
            </div>

            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">
              Let's Connect & Share Stories
            </h3>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
              Whether you're building something, reading something great, or have adventures to share—
              I'd love to hear from you. The best conversations happen when curious minds meet.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact">
                <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  Start a Conversation
                </button>
              </Link>
              <Link href="/thoughts">
                <button className="px-8 py-4 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-2 border-slate-200 dark:border-slate-600 rounded-full font-semibold hover:border-blue-600 dark:hover:border-blue-400 transition-colors">
                  Read My Thoughts
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}