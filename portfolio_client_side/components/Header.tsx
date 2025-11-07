// app/components/Header.tsx
'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Sun, Moon, Home, User, BookOpen, MessageSquare, Mail } from 'lucide-react'

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'About', href: '/about', icon: User },
  { name: 'Thoughts', href: '/thoughts', icon: MessageSquare },
  { name: 'Reading', href: '/reading', icon: BookOpen },
  { name: 'Contact', href: '/contact', icon: Mail },
]

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleTheme = () => {
    setIsDark(!isDark)
    // In a real app, you'd persist this and apply the theme
    document.documentElement.classList.toggle('dark')
  }

  return (
    <>
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-lg' 
          : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <div className="relative w-10 h-10">
                <div className="w-full h-full rounded-full overflow-hidden ring-2 ring-blue-500/20">
                  <img
                    src="/profile.png"
                    alt="Tonny Nyauke"
                    className="w-full h-full object-cover"
                  />
                  {/* Fallback with initials */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg opacity-0">
                    TN
                  </div>
                </div>
              </div>
              <span className="text-xl font-bold text-slate-400 dark:text-slate-200">
                Tonny Nyauke
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>

            {/* Theme Toggle & Mobile Menu */}
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 right-0 h-full w-80 bg-white dark:bg-slate-900 shadow-2xl z-50 md:hidden"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
                  <div className="flex items-center space-x-3">
                    <div className="relative w-10 h-10">
                      <div className="w-full h-full rounded-full overflow-hidden ring-2 ring-blue-500/20">
                        <img
                          src="/api/placeholder/40/40"
                          alt="Tonny Nyauke"
                          className="w-full h-full object-cover"
                        />
                        {/* Fallback with initials */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg opacity-0">
                          TN
                        </div>
                      </div>
                    </div>
                    <span className="text-lg font-bold text-slate-800 dark:text-slate-200">
                      Menu
                    </span>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-6 py-8">
                  <div className="space-y-4">
                    {navigation.map((item, index) => (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center space-x-4 p-4 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
                        >
                          <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
                            <item.icon className="w-5 h-5" />
                          </div>
                          <span className="text-lg font-medium">{item.name}</span>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </nav>

                {/* Footer */}
                <div className="p-6 border-t border-slate-200 dark:border-slate-700">
                  <div className="text-center">
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                      Building with purpose
                    </p>
                    <div className="flex justify-center space-x-4">
                      <span className="text-xs text-slate-400">🚀 Nairobi</span>
                      <span className="text-xs text-slate-400">📚 Always Learning</span>
                      <span className="text-xs text-slate-400">✨ SDA</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer for fixed header */}
      <div className="h-16"></div>
    </>
  )
}