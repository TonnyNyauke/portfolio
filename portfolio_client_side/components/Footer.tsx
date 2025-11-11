// app/components/Footer.tsx
'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, Mail, Twitter, Linkedin, Github, MapPin, Instagram } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-slate-300">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="relative w-12 h-12">
                <div className="w-full h-full rounded-full overflow-hidden ring-2 ring-blue-500/20">
                  <img
                    src="/profile.png"
                    alt="Tonny Nyauke"
                    className="w-full h-full object-cover"
                  />
                  {/* Fallback with initials */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl opacity-0">
                    TN
                  </div>
                </div>
              </div>
              <span className="text-2xl font-bold text-white">
                Tonny Nyauke
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed mb-6 max-w-md">
              Building SaaS solutions, sharing insights on tech and business, 
              and exploring how faith shapes entrepreneurship. Always learning, 
              always building.
            </p>
            <div className="flex items-center space-x-2 text-sm text-slate-400">
              <MapPin className="w-4 h-4" />
              <span>Homa Bay, Kenya</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-slate-400 hover:text-blue-400 transition-colors">
                  About Me
                </Link>
              </li>
              <li>
                <Link href="/thoughts" className="text-slate-400 hover:text-blue-400 transition-colors">
                  My Thoughts
                </Link>
              </li>
              <li>
                <Link href="/reading" className="text-slate-400 hover:text-blue-400 transition-colors">
                  Reading List
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-slate-400 hover:text-blue-400 transition-colors">
                  Projects
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Let's Connect</h3>
            <div className="space-y-4">
              <Link 
                href="mailto:tonnynyauke@tonnynyauke.com" 
                className="flex items-center space-x-3 text-slate-400 hover:text-blue-400 transition-colors"
              >
                <Mail className="w-5 h-5" />
                <span>Email Me</span>
              </Link>
              <div className="flex space-x-4">
              <Link 
                  href="https://www.instagram.com/nyauke_industries/" target='_blank'
                  className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-blue-400 hover:bg-slate-700 transition-colors"
                >
                  <Instagram className="w-5 h-5 mr-2" />
                </Link>
                {/* <Link 
                  href="https://x.com/TonnyNyauke" target='_blank' 
                  className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-blue-400 hover:bg-slate-700 transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </Link> */}
                <Link 
                  href="www.linkedin.com/in/tonnynyauke" target='_blank' 
                  className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-blue-400 hover:bg-slate-700 transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </Link>
                <Link 
                  href="https://github.com/TonnyNyauke" target='_blank' 
                  className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-blue-400 hover:bg-slate-700 transition-colors"
                >
                  <Github className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-slate-400 mb-4 md:mb-0">
              © {new Date().getFullYear()} Tonny Nyauke. Built with Next.js and lots of{' '}
              <Heart className="w-4 h-4 inline text-rose-500" />
            </p>
            <div className="flex items-center space-x-6 text-sm text-slate-400">
              <span>🚀 Currently building Zuriscale</span>
              <span>📚 Always reading</span>
              <span>✨ SDA Christian</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}