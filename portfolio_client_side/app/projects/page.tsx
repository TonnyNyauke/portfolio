//app/projects
'use client'

import React, { useState, useEffect } from 'react';
import { Calendar, Tag, Search, ArrowLeft, ArrowRight, ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ProjectDetails } from './project';

const ITEMS_PER_PAGE = 8;

const Breadcrumbs = () => (
  <nav aria-label="Breadcrumb" className="mb-6">
    <ol className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
      <li className="flex items-center">
        <Link href="/" className="flex items-center hover:text-gray-900 dark:hover:text-gray-100">
          <Home className="h-4 w-4" />
          <span className="sr-only">Home</span>
        </Link>
      </li>
      <li className="flex items-center">
        <ChevronRight className="h-4 w-4" />
        <span className="ml-2">Projects</span>
      </li>
    </ol>
  </nav>
);

export default function ProjectsPage() {
  const [allProjects, setAllProjects] = useState<ProjectDetails[]>([]);
  const [projects, setProjects] = useState<ProjectDetails[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  // Fetch projects from API
  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch('/api/projects', { cache: 'no-store' });
        const data = await res.json();
        setAllProjects(data.projects || []);
        setProjects(data.projects || []);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  // Get unique categories from projects
  const categories = ['all', ...new Set(allProjects.map(project => project.category))];

  // Filter projects based on search and category
  useEffect(() => {
    let filtered = allProjects;
    
    if (searchQuery) {
      filtered = filtered.filter(project => 
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(project => project.category === selectedCategory);
    }
    
    setProjects(filtered);
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, allProjects]);

  const totalPages = Math.ceil(projects.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayedProjects = projects.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <main className="min-h-screen text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">Loading projects...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      {/* Mobile Breadcrumbs - Only visible on small screens */}
      <div className="block md:hidden max-w-7xl mx-auto">
        <Breadcrumbs />
      </div>

      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-12">
        {/* Desktop Breadcrumbs - Only visible on larger screens */}
        <div className="hidden md:block mb-6">
          <Breadcrumbs />
        </div>
        
        <h1 className="text-4xl font-bold mb-4">My Projects</h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          Explore my latest work and side projects
        </p>
      </div>

      {/* Filters Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search projects..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Projects Grid */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {displayedProjects.map(project => (
          <motion.div
            key={project.id}
            variants={item}
            className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <Link href={`/projects/${project.id}`} className="block">
              <div className="relative h-48">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform hover:scale-105 duration-300"
                />
                {project.featured && (
                  <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                      Featured
                    </span>
                  </div>
                )}
              </div>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2 line-clamp-1">{project.title}</h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 text-sm">
                  <div className="flex items-center text-gray-500 dark:text-gray-400">
                    <Tag className="w-4 h-4 mr-1" />
                    {project.category}
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="max-w-7xl mx-auto mt-8 flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                onClick={() => setCurrentPage(page)}
                className="w-10"
              >
                {page}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}

      {/* No Results */}
      {displayedProjects.length === 0 && (
        <div className="max-w-7xl mx-auto text-center py-12">
          <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100">No projects found</h3>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Try adjusting your search or filter to find what you&apos;re looking for.
          </p>
        </div>
      )}
    </main>
  );
}