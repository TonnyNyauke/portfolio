'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, Tag, Twitter, Linkedin, Link as LinkIcon, ArrowLeft, Mail, CheckCircle, TrendingUp, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface Thought {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  tags: string[];
  coverImage?: string;
  views?: number;
}

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export default function ThoughtDetailPage() {
  const params = useParams()
  const thoughtId = params?.id as string
  
  const [thought, setThought] = useState<Thought | null>(null);
  const [relatedThoughts, setRelatedThoughts] = useState<Thought[]>([]);
  const [loading, setLoading] = useState(true);
  const [readingProgress, setReadingProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [tocItems, setTocItems] = useState<TOCItem[]>([]);
  
  const contentRef = useRef<HTMLDivElement>(null);

  // Fetch thought data
  useEffect(() => {
    if (!thoughtId) return;
    
    async function fetchThought() {
      try {
        const res = await fetch(`/api/admin/blogs/${thoughtId}`);
        if (!res.ok) throw new Error('Failed to fetch thought');
        
        const data = await res.json();
        setThought(data.blog);
        
        // Fetch related thoughts (you'll need to implement this endpoint)
        try {
          const relatedRes = await fetch(`/api/admin/blogs?category=${data.blog.category}&exclude=${thoughtId}&limit=3`);
          if (relatedRes.ok) {
            const relatedData = await relatedRes.json();
            setRelatedThoughts(relatedData.blogs || []);
          }
        } catch (err) {
          console.error('Error fetching related thoughts:', err);
        }
        
        // Parse content for TOC
        if (data.blog.content) {
          const headings = extractHeadings(data.blog.content);
          setTocItems(headings);
        }
      } catch (error) {
        console.error('Error fetching thought:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchThought();
  }, [thoughtId]);

  // Extract headings from content for TOC
  const extractHeadings = (content: string): TOCItem[] => {
    const regex = /^(#{1,3})\s+(.+)$/gm;
    const headings: TOCItem[] = [];
    let match;
    
    while ((match = regex.exec(content)) !== null) {
      headings.push({
        id: match[2].toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        text: match[2],
        level: match[1].length
      });
    }
    
    return headings;
  };

  // Track reading progress
  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;
      
      const windowHeight = window.innerHeight;
      const documentHeight = contentRef.current.scrollHeight;
      const scrollTop = window.scrollY;
      const trackLength = documentHeight - windowHeight;
      const progress = Math.floor((scrollTop / trackLength) * 100);
      
      setReadingProgress(Math.min(Math.max(progress, 0), 100));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Share functionality
  const handleShare = (platform: string) => {
    if (typeof window === 'undefined') return;
    
    const shareUrl = window.location.href;
    const text = thought?.title || '';
    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      copy: shareUrl
    };
    
    if (platform === 'copy') {
      navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard!');
    } else {
      window.open(urls[platform], '_blank');
    }
  };

  // Newsletter subscription
  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription API
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 3000);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Business': 'from-emerald-500 to-teal-600',
      'Tech': 'from-blue-500 to-indigo-600',
      'Faith & Business': 'from-amber-500 to-orange-600',
      'Others': 'from-purple-500 to-pink-600'
    };
    return colors[category] || 'from-gray-500 to-gray-600';
  };

  // Render markdown content
  const renderMarkdown = (content: string) => {
    // Basic markdown rendering - in production use a library like react-markdown
    return content.split('\n').map((line, i) => {
      // Headings
      if (line.startsWith('### ')) {
        const text = line.slice(4);
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        return <h3 key={i} id={id} className="text-xl font-bold text-gray-900 dark:text-white mt-6 mb-3">{text}</h3>;
      }
      if (line.startsWith('## ')) {
        const text = line.slice(3);
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        return <h2 key={i} id={id} className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">{text}</h2>;
      }
      if (line.startsWith('# ')) {
        const text = line.slice(2);
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        return <h1 key={i} id={id} className="text-3xl font-bold text-gray-900 dark:text-white mt-8 mb-4">{text}</h1>;
      }
      // Paragraphs
      if (line.trim()) {
        return <p key={i} className="mb-4">{line}</p>;
      }
      return <br key={i} />;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading thought...</p>
        </div>
      </div>
    );
  }

  if (!thought) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Thought not found</h2>
          <Link href="/thoughts" className="text-blue-600 dark:text-blue-400 hover:underline">
            Back to thoughts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-800 z-50">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-indigo-600"
          style={{ width: `${readingProgress}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${readingProgress}%` }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Back Button */}
        <Link href="/thoughts">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to thoughts
          </motion.button>
        </Link>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Table of Contents - Desktop Sidebar */}
          {tocItems.length > 0 && (
            <aside className="hidden lg:block lg:col-span-3">
              <div className="sticky top-24 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wide">
                  Table of Contents
                </h3>
                <nav className="space-y-2">
                  {tocItems.map((item, index) => (
                    <a
                      key={index}
                      href={`#${item.id}`}
                      className={`block text-sm transition-colors ${
                        item.level === 1 ? 'font-semibold' : item.level === 2 ? 'ml-4' : 'ml-8'
                      } ${
                        activeSection === item.id
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
                      }`}
                    >
                      {item.text}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>
          )}

          {/* Main Content */}
          <main className={tocItems.length > 0 ? "lg:col-span-9" : "lg:col-span-12"}>
            <article className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
              {/* Cover Image */}
              {thought.coverImage && (
                <div className="h-96 bg-gradient-to-br from-blue-500 to-indigo-600 overflow-hidden">
                  <img 
                    src={thought.coverImage} 
                    alt={thought.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Article Header */}
              <div className="p-8 md:p-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    <span className={`px-4 py-2 text-sm font-semibold rounded-full bg-gradient-to-r ${getCategoryColor(thought.category)} text-white`}>
                      {thought.category}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(thought.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {thought.readTime}
                    </span>
                    {thought.views !== undefined && (
                      <span className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        {thought.views} views
                      </span>
                    )}
                  </div>

                  <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                    {thought.title}
                  </h1>

                  <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                    {thought.excerpt}
                  </p>

                  {/* Tags */}
                  {thought.tags && thought.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-8">
                      {thought.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-full text-sm flex items-center gap-1"
                        >
                          <Tag className="w-3 h-3" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Share Buttons */}
                  <div className="flex items-center gap-4 pb-8 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Share:</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleShare('twitter')}
                        className="p-2 bg-gray-100 dark:bg-slate-700 hover:bg-blue-500 hover:text-white rounded-lg transition-all"
                      >
                        <Twitter className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleShare('linkedin')}
                        className="p-2 bg-gray-100 dark:bg-slate-700 hover:bg-blue-700 hover:text-white rounded-lg transition-all"
                      >
                        <Linkedin className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleShare('copy')}
                        className="p-2 bg-gray-100 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 rounded-lg transition-all"
                      >
                        <LinkIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>

                {/* Article Content */}
                <motion.div
                  ref={contentRef}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="prose prose-lg dark:prose-invert max-w-none mt-8"
                >
                  <div className="text-gray-700 dark:text-gray-300 leading-relaxed space-y-6">
                    {renderMarkdown(thought.content)}
                  </div>
                </motion.div>
              </div>
            </article>

            {/* Newsletter CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white"
            >
              <div className="max-w-2xl mx-auto text-center">
                <Mail className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Want more insights like this?</h3>
                <p className="text-blue-100 mb-6">
                  Subscribe to my newsletter for weekly thoughts on tech, business, and faith.
                </p>
                
                {!subscribed ? (
                  <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                    />
                    <button
                      type="submit"
                      className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                    >
                      Subscribe
                    </button>
                  </form>
                ) : (
                  <div className="flex items-center justify-center gap-2 text-white">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-semibold">Thanks for subscribing!</span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Related Thoughts */}
            {relatedThoughts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-12"
              >
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                  Related Thoughts
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {relatedThoughts.map((related) => (
                    <Link key={related.id} href={`/thoughts/${related.id}`}>
                      <article className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-200 dark:border-gray-700">
                        <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r ${getCategoryColor(related.category)} text-white mb-3`}>
                          {related.category}
                        </span>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                          {related.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                          {related.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                          <span>{related.readTime}</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}