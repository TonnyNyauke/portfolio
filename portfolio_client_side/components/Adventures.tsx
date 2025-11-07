'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Camera, Users, MessageCircle, Compass, Heart, Code, Calendar, ArrowRight } from 'lucide-react'
import Link from 'next/link'

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

// Icon mapping
const iconMap: Record<string, any> = {
  Heart,
  Users,
  Compass,
  MessageCircle,
  Camera,
  Code
}

export default function Adventures() {
  const [adventures, setAdventures] = useState<Adventure[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAdventures()
  }, [])

  const fetchAdventures = async () => {
    try {
      const res = await fetch('/api/adventures')
      const data = await res.json()
      setAdventures(data.adventures || [])
    } catch (error) {
      console.error('Error fetching adventures:', error)
    } finally {
      setLoading(false)
    }
  }

  // Group adventures by type
  const groupedAdventures = {
    Experience: adventures.filter(a => a.type === 'Experience'),
    Community: adventures.filter(a => a.type === 'Community'),
    Travel: adventures.filter(a => a.type === 'Travel')
  }

  // Get recent adventures for the timeline
  const recentAdventures = adventures
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3)

  if (loading) {
    return (
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-6">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded w-64 mx-auto"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-64 bg-slate-200 dark:bg-slate-700 rounded-2xl"></div>
              ))}
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
            Adventures & Experiences
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto"
          >
            Beyond code and books—exploring life, business, and meaningful connections
          </motion.p>
        </div>

        {/* Adventure Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {Object.entries(groupedAdventures).map(([type, typeAdventures], index) => {
            // Get the latest adventure for this type
            const latestAdventure = typeAdventures[0]
            
            if (!latestAdventure) {
              // Show placeholder if no adventures of this type exist
              return (
                <motion.div
                  key={type}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700 opacity-50"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className={`p-4 rounded-xl bg-gradient-to-br ${
                      type === 'Experience' ? 'from-rose-500 to-pink-600' :
                      type === 'Community' ? 'from-blue-500 to-indigo-600' :
                      'from-emerald-500 to-teal-600'
                    } shadow-lg`}>
                      {type === 'Experience' && <Heart className="w-6 h-6 text-white" />}
                      {type === 'Community' && <Users className="w-6 h-6 text-white" />}
                      {type === 'Travel' && <Compass className="w-6 h-6 text-white" />}
                    </div>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r ${
                      type === 'Experience' ? 'from-rose-500 to-pink-600' :
                      type === 'Community' ? 'from-blue-500 to-indigo-600' :
                      'from-emerald-500 to-teal-600'
                    } text-white`}>
                      {type}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">
                    {type} Adventures
                  </h3>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-4">
                    Coming Soon
                  </p>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    More {type.toLowerCase()} stories on the way...
                  </p>
                </motion.div>
              )
            }

            const IconComponent = iconMap[latestAdventure.icon] || Heart

            return (
              <motion.div
                key={type}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 dark:border-slate-700"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className={`p-4 rounded-xl bg-gradient-to-br ${latestAdventure.color} shadow-lg`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r ${latestAdventure.color} text-white`}>
                      {latestAdventure.type}
                    </span>
                    {latestAdventure.status === 'ongoing' && (
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-500 text-white flex items-center gap-1">
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                        Live
                      </span>
                    )}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">
                  {latestAdventure.title}
                </h3>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-4">
                  {latestAdventure.subtitle}
                </p>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4 line-clamp-3">
                  {latestAdventure.description}
                </p>

                {/* Show count if multiple adventures exist */}
                {typeAdventures.length > 1 && (
                  <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <Link href="/adventures" className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                      View all {typeAdventures.length} {type.toLowerCase()} adventures
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* Recent Experiences Timeline */}
        {recentAdventures.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <motion.h3 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-8 flex items-center gap-3"
            >
              <MessageCircle className="w-6 h-6 text-blue-600" />
              Recent Experiences
            </motion.h3>

            <div className="space-y-6">
              {recentAdventures.map((adventure, index) => {
                const IconComponent = iconMap[adventure.icon] || Heart
                const formattedDate = new Date(adventure.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })

                return (
                  <motion.div
                    key={adventure.id}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Link href={`/adventures/${adventure.id}`}>
                      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-slate-200 dark:border-slate-700 cursor-pointer group">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg bg-gradient-to-br ${adventure.color}`}>
                              <IconComponent className="w-4 h-4 text-white" />
                            </div>
                            <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {adventure.title}
                            </h4>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {formattedDate}
                            </div>
                            <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-full text-xs">
                              {adventure.type}
                            </span>
                          </div>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2 ml-11">
                          {adventure.description}
                        </p>
                        {adventure.location && (
                          <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 mt-3 ml-11">
                            <MapPin className="w-4 h-4" />
                            {adventure.location}
                          </div>
                        )}
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          </div>
        )}

        {/* Call to Action */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-16 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-12"
        >
          <div className="flex items-center justify-center gap-2 mb-6">
            <Camera className="w-6 h-6 text-blue-600" />
            <MapPin className="w-6 h-6 text-emerald-600" />
            <MessageCircle className="w-6 h-6 text-purple-600" />
          </div>
          
          <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">
            Let&apos;s Connect & Share Stories
          </h3>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
            Whether you&apos;re building something, reading something great, or have adventures to share—
            I&apos;d love to hear from you. The best conversations happen when curious minds meet.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link href='/contact'>
              <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                Start a Conversation
              </button>
            </Link>
            <Link href='/adventures'>
              <button className="px-8 py-4 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-2 border-slate-200 dark:border-slate-600 rounded-full font-semibold hover:border-blue-600 dark:hover:border-blue-400 transition-colors">
                Follow the Journey
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}