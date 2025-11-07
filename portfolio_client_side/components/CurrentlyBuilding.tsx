// app/components/CurrentlyBuilding.tsx
'use client'

import { motion } from 'framer-motion'
import { ExternalLink, Smartphone, Users, TrendingUp, Globe, Zap, Target } from 'lucide-react'
import { Button } from './ui/button'
import Link from 'next/link'

const projects = [
  {
    title: "Zuriscale",
    subtitle: "SaaS for Boutique Owners",
    description: "Building a platform that helps boutique owners increase revenue through customer retention via WhatsApp. Working on customer acquisition, product-market fit, and scaling strategies.",
    status: "Active Development",
    category: "My SaaS Journey",
    icon: TrendingUp,
    link: "https://www.zuriscale.com",
    color: "from-emerald-500 to-teal-600",
    highlight: true,
    details: [
      "Customer retention via WhatsApp automation",
      "Revenue optimization for boutiques",
      "Currently in customer discovery phase"
    ]
  },
  {
    title: "Hypebuzz Kenya Limited Ticketing App",
    subtitle: "Events Platform",
    description: "Developing a comprehensive web application for Hypebuzz Kenya in Nairobi. Focusing on improving customer experience and service delivery for their events services.",
    status: "In Progress",
    category: "Client Project",
    icon: Smartphone,
    color: "from-blue-500 to-indigo-600",
    details: [
      "Customer service optimization",
      "Service delivery tracking",
      "Fiber internet management"
    ]
  },
  {
    title: "Recent Client Work",
    subtitle: "Web Solutions Portfolio",
    description: "Recently completed impactful projects including Ke Devries Farm, Profia Institute, and Rural Digital Kenya. Each focused on creating meaningful digital experiences.",
    status: "Recent Work",
    category: "Portfolio",
    icon: Globe,
    color: "from-violet-500 to-purple-600",
    details: [
      "E-commerce and business websites",
      "Educational platform solutions",
      "Rural connectivity initiatives"
    ]
  }
]

export default function CurrentlyBuilding() {
  return (
    <section className="py-20 bg-white dark:bg-slate-800">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold mb-4 text-slate-800 dark:text-slate-200"
          >
            What I'm Building
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto"
          >
            Current projects and the stories behind them
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`group bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 dark:border-slate-600 ${
                project.highlight ? 'ring-2 ring-emerald-500/20 dark:ring-emerald-400/20' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-6">
                <div className={`p-4 rounded-xl bg-gradient-to-br ${project.color} shadow-lg`}>
                  <project.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-2">
                  {project.highlight && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                      <Zap className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Featured</span>
                    </div>
                  )}
                  {project.link && (
                    <a 
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">
                    {project.title}
                  </h3>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full bg-gradient-to-r ${project.color} text-white`}>
                    {project.status}
                  </span>
                </div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-4">
                  {project.subtitle}
                </p>
              </div>

              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                {project.description}
              </p>

              {/* Project details */}
              <div className="space-y-2 mb-6">
                {project.details.map((detail, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <Target className="w-3 h-3 text-blue-500" />
                    <span>{detail}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-600">
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {project.category}
                </span>
                {project.highlight && (
                  <span className="text-sm text-emerald-600 dark:text-emerald-400 font-semibold">
                    🚀 My Main Focus
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <p className="text-slate-600 dark:text-slate-400 text-lg mb-6">
            Want to follow along? I share updates, challenges, and wins as they happen.
          </p>
          <Link href='/projects'>
            <Button className="px-8 py-4 bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-800 rounded-full font-semibold hover:bg-slate-700 dark:hover:bg-slate-300 transition-colors">
              View Project Updates
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}