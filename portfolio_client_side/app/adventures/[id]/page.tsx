// app/adventures/[id]/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { Calendar, MapPin, ArrowLeft, Share2, Twitter, Linkedin, Facebook, Heart, Users, Compass, MessageCircle, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import ReactMarkdown from 'react-markdown'

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

interface RelatedItem {
  id: string
  title: string
  type: 'adventure' | 'blog'
  date: string
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

export default function AdventureDetailPage() {
  const params = useParams()
  const [adventure, setAdventure] = useState<Adventure | null>(null)
  const [relatedContent, setRelatedContent] = useState<RelatedItem[]>([])
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    async function fetchAdventure() {
      try {
        const res = await fetch(`/api/adventures/${params.id}`, { cache: 'no-store' })
        const data = await res.json()
        setAdventure(data.adventure)
        setRelatedContent(data.related || [])
      } catch (error) {
        console.error('Error fetching adventure:', error)
      } finally {
        setLoading(false)
      }
    }
    
    if (params.id) {
      fetchAdventure()
    }
  }, [params.id])

  const handleShare = (platform: string) => {
    const url = window.location.href
    const text = adventure?.title || ''
    
    const shareUrls: { [key: string]: string } = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    }
    
    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400')
    }
  }

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    alert('Link copied to clipboard!')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 py-32">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-4">
              <div className="h-96 bg-slate-200 dark:bg-slate-700 rounded-2xl"></div>
              <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
              <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!adventure) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 py-32">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-200 mb-4">
            Adventure Not Found
          </h1>
          <Link href="/adventures">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Back to Adventures
            </button>
          </Link>
        </div>
      </div>
    )
  }

  const IconComponent = typeIcons[adventure.type] || MessageCircle
  const colorClass = typeColors[adventure.type] || 'from-slate-500 to-slate-600'

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      {/* Back Button */}
      <div className="pt-32 pb-8">
        <div className="container mx-auto px-6">
          <Link href="/adventures">
            <button className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Adventures</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Hero Image Gallery */}
      {adventure.images && adventure.images.length > 0 && (
        <section className="pb-12">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto">
              <div className="relative h-96 md:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src={adventure.images[currentImageIndex]}
                  alt={adventure.title}
                  fill
                  className="object-cover"
                />
                {adventure.status === 'ongoing' && (
                  <div className="absolute top-6 right-6 px-4 py-2 bg-green-500 text-white font-semibold rounded-full flex items-center gap-2 shadow-lg">
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                    Ongoing Adventure
                  </div>
                )}
              </div>

              {/* Image Thumbnails */}
              {adventure.images.length > 1 && (
                <div className="flex gap-4 mt-4 overflow-x-auto pb-2">
                  {adventure.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all ${
                        currentImageIndex === index
                          ? 'border-blue-600 scale-105'
                          : 'border-slate-300 dark:border-slate-600 hover:border-blue-400'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${adventure.title} ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Content */}
      <section className="pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <article className="bg-white dark:bg-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl border border-slate-200 dark:border-slate-700">
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClass}`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <span className={`px-4 py-2 text-sm font-semibold rounded-full bg-gradient-to-r ${colorClass} text-white`}>
                    {adventure.type}
                  </span>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-slate-200 mb-4">
                  {adventure.title}
                </h1>

                <p className="text-xl text-slate-600 dark:text-slate-400 mb-6">
                  {adventure.subtitle}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <span>{getRelativeTime(adventure.date)}</span>
                  </div>
                  {adventure.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      <span>{adventure.location}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Share Buttons */}
              <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-200 dark:border-slate-700">
                <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                  Share:
                </span>
                <button
                  onClick={() => handleShare('twitter')}
                  className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                  aria-label="Share on Twitter"
                >
                  <Twitter className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </button>
                <button
                  onClick={() => handleShare('linkedin')}
                  className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                  aria-label="Share on LinkedIn"
                >
                  <Linkedin className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </button>
                <button
                  onClick={() => handleShare('facebook')}
                  className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                  aria-label="Share on Facebook"
                >
                  <Facebook className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </button>
                <button
                  onClick={copyLink}
                  className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                  aria-label="Copy link"
                >
                  <Share2 className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </button>
              </div>

              {/* Content - Markdown */}
              <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-slate-800 dark:prose-headings:text-slate-200 prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-strong:text-slate-800 dark:prose-strong:text-slate-200">
                <ReactMarkdown>{adventure.content}</ReactMarkdown>
              </div>
            </article>

            {/* Related Content */}
            {relatedContent.length > 0 && (
              <div className="mt-16">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-8">
                  Related {relatedContent.some(item => item.type === 'blog') ? 'Content' : 'Adventures'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {relatedContent.map((item) => (
                    <Link
                      key={item.id}
                      href={item.type === 'adventure' ? `/adventures/${item.id}` : `/thoughts/${item.id}`}
                    >
                      <div className="group bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                            {item.type}
                          </span>
                          <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {item.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                          <Calendar className="w-4 h-4" />
                          <span>{getRelativeTime(item.date)}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}