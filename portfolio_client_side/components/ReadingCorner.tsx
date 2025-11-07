'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Star, Clock, ArrowRight } from 'lucide-react'
import Link from 'next/link';

interface BookNote {
  id: string;
  page: number;
  note: string;
  date: string;
  chapter?: string;
}

interface Book {
  id: string;
  title: string;
  author: string;
  genre: 'Business' | 'Tech' | 'Christian' | 'Others';
  currentPage: number;
  totalPages: number;
  startDate: string;
  status: 'currently-reading' | 'finished' | 'want-to-read';
  rating?: number;
  notes: BookNote[];
  coverColor: string;
}

const getProgressPercentage = (current: number, total: number) => {
  if (!total || total <= 0) return 0;
  return Math.round((current / total) * 100);
};

const ReadingCard = ({ book, type = 'current' }: { book: Book, type?: 'current' | 'finished' }) => {
  const progress = getProgressPercentage(book.currentPage, book.totalPages);
  const latestNote = book.notes && book.notes.length > 0 ? book.notes[book.notes.length - 1].note : "Reading and taking notes...";
  
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-700">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2 rounded-lg bg-gradient-to-br ${book.coverColor} shadow-md`}>
          <BookOpen className="w-5 h-5 text-white" />
        </div>
        <span className={`px-2 py-1 text-xs font-semibold rounded-full bg-gradient-to-r ${book.coverColor} text-white`}>
          {book.genre}
        </span>
      </div>
      
      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-1">
        {book.title}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
        by {book.author}
      </p>
      
      {type === 'current' && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400 mb-2">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
            <div 
              className={`h-2 rounded-full bg-gradient-to-r ${book.coverColor}`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}
      
      {book.rating && (
        <div className="flex items-center gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`w-4 h-4 ${i < book.rating! ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300 dark:text-slate-600'}`} 
            />
          ))}
        </div>
      )}
      
      <p className="text-sm text-slate-600 dark:text-slate-300 italic">
        &quot;{latestNote}&quot;
      </p>
    </div>
  );
};

export default function ReadingCorner() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch books from API
  useEffect(() => {
    async function fetchBooks() {
      try {
        const res = await fetch('/api/admin/reading', { cache: 'no-store' });
        const data = await res.json();
        setBooks(data.books || []);
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchBooks();
  }, []);

  const currentlyReading = books.filter(book => book.status === 'currently-reading');
  const recentFinished = books.filter(book => book.status === 'finished');

  if (loading) {
    return (
      <section className="py-20 bg-white dark:bg-slate-800">
        <div className="container mx-auto px-6 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </section>
    );
  }

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
            Reading Corner
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto"
          >
            Books that are shaping my thinking and approach to building things
          </motion.p>
        </div>

        {/* Currently Reading */}
        {currentlyReading.length > 0 && (
          <div className="mb-16">
            <motion.h3 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-8 flex items-center gap-3"
            >
              <Clock className="w-6 h-6 text-blue-600" />
              Currently Reading
            </motion.h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentlyReading.map((book, index) => (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <ReadingCard book={book} type="current" />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Recently Finished */}
        {recentFinished.length > 0 && (
          <div>
            <motion.h3 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-8 flex items-center gap-3"
            >
              <Star className="w-6 h-6 text-yellow-500" />
              Recently Finished
            </motion.h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentFinished.map((book, index) => (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <ReadingCard book={book} type="finished" />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <div className="flex items-center justify-center gap-2 text-slate-600 dark:text-slate-400 mb-6">
            <BookOpen className="w-5 h-5" />
            <span>Want book recommendations or to discuss what I'm reading?</span>
          </div>
          <Link href='/reading'>
            <button className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300">
              <span>View Full Reading List</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}