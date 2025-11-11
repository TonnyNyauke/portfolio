'use client'

import React, { useState, useEffect, useMemo } from 'react';
import { Book, Filter, Grid, List, BookOpen, CheckCircle, MessageSquare, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface BookNote {
  id: string;
  page: number;
  note: string;
  date: string;
  chapter?: string;
}

export interface Book {
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

const ReadingPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch books from API
  useEffect(() => {
    async function fetchBooks() {
      try {
        const res = await fetch('/api/reading', { cache: 'no-store' });
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

  const readingStats = useMemo(() => {
    // Calculate pages this week
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Start of current week (Sunday)
    startOfWeek.setHours(0, 0, 0, 0);

    let pagesThisWeek = 0;
    
    books.forEach(book => {
      // Get notes from this week
      const notesThisWeek = book.notes?.filter(note => {
        const noteDate = new Date(note.date);
        return noteDate >= startOfWeek;
      }) || [];

      if (notesThisWeek.length > 0) {
        // Calculate pages based on note progression
        const maxPageThisWeek = Math.max(...notesThisWeek.map(n => n.page));
        const previousMaxPage = book.notes
          ?.filter(note => {
            const noteDate = new Date(note.date);
            return noteDate < startOfWeek;
          })
          .map(n => n.page)
          .reduce((max, page) => Math.max(max, page), 0) || 0;
        
        pagesThisWeek += Math.max(0, maxPageThisWeek - previousMaxPage);
      } else if (book.status === 'currently-reading') {
        // If book was started this week, use currentPage as estimate
        const startDate = new Date(book.startDate);
        if (startDate >= startOfWeek) {
          pagesThisWeek += book.currentPage;
        }
      }
    });

    // Calculate pages this month
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    startOfMonth.setHours(0, 0, 0, 0);

    let pagesThisMonth = 0;
    
    books.forEach(book => {
      // Get notes from this month
      const notesThisMonth = book.notes?.filter(note => {
        const noteDate = new Date(note.date);
        return noteDate >= startOfMonth;
      }) || [];

      if (notesThisMonth.length > 0) {
        // Calculate pages based on note progression
        const maxPageThisMonth = Math.max(...notesThisMonth.map(n => n.page));
        const previousMaxPage = book.notes
          ?.filter(note => {
            const noteDate = new Date(note.date);
            return noteDate < startOfMonth;
          })
          .map(n => n.page)
          .reduce((max, page) => Math.max(max, page), 0) || 0;
        
        pagesThisMonth += Math.max(0, maxPageThisMonth - previousMaxPage);
      } else if (book.status === 'currently-reading') {
        // If book was started this month, use currentPage as estimate
        const startDate = new Date(book.startDate);
        if (startDate >= startOfMonth) {
          pagesThisMonth += book.currentPage;
        }
      }
    });

    return {
      pagesThisWeek,
      pagesThisMonth,
      booksFinished: books.filter(b => b.status === 'finished').length
    };
  }, [books]);

  const filteredBooks = selectedGenre === 'all' 
    ? books 
    : books.filter(book => book.genre.toLowerCase() === selectedGenre.toLowerCase());

  const currentlyReading = filteredBooks.filter(book => book.status === 'currently-reading');
  const finished = filteredBooks.filter(book => book.status === 'finished');
  const wantToRead = filteredBooks.filter(book => book.status === 'want-to-read');

  const getProgressPercentage = (current: number, total: number) => {
    if (!total || total <= 0) return 0;
    return Math.round((current / total) * 100);
  };

  const BookCard: React.FC<{ book: Book }> = ({ book }) => {
    const progress = getProgressPercentage(book.currentPage, book.totalPages);
    
    return (
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
        {/* Book Cover Simulation */}
        <div className={`w-20 h-28 bg-gradient-to-br ${book.coverColor} rounded-lg mb-4 flex items-end justify-center p-2 shadow-lg`}>
          <div className="text-white text-xs font-bold text-center leading-tight">
            {book.title.split(' ').slice(0, 2).join(' ')}
          </div>
        </div>
        
        <div className="mb-4">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">{book.title}</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">by {book.author}</p>
          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
            book.genre === 'Business' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' :
            book.genre === 'Tech' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
            book.genre === 'Christian' ? 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200' :
            'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200'
          }`}>
            {book.genre}
          </span>
        </div>

        {book.status !== 'want-to-read' && (
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span>Page {book.currentPage} of {book.totalPages}</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full bg-gradient-to-r ${book.coverColor}`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {book.status === 'finished' && book.rating && (
          <div className="mb-4 flex items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">Rating:</span>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={`text-lg ${i < book.rating! ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}>
                  ★
                </span>
              ))}
            </div>
          </div>
        )}

        {book.notes && book.notes.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Recent Notes</span>
              <MessageSquare className="w-4 h-4 text-gray-500" />
            </div>
            {book.notes.slice(-2).map((note) => (
              <div key={note.id} className="text-xs text-gray-600 dark:text-gray-400 mb-2 p-2 bg-gray-50 dark:bg-slate-700 rounded">
                <span className="font-medium">Page {note.page}:</span> {note.note.slice(0, 100)}{note.note.length > 100 ? '...' : ''}
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>Started: {new Date(book.startDate).toLocaleDateString()}</span>
          {book.notes && book.notes.length > 0 && (
            <button className="text-blue-600 dark:text-blue-400 hover:underline flex items-center">
              View All Notes
              <ArrowRight className="w-3 h-3 ml-1" />
            </button>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your reading journey...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            My Reading Journey
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Tracking progress, capturing insights, and sharing knowledge
          </p>
        </div>

        {/* Reading Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-500 mb-1">{readingStats.pagesThisWeek}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Pages This Week</div>
          </div>
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-500 mb-1">{readingStats.pagesThisMonth}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Pages This Month</div>
          </div>
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-purple-500 mb-1">{readingStats.booksFinished}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Books Finished</div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center space-x-4">
            <Filter className="w-5 h-5 text-gray-500" />
            <label htmlFor="genre-select" className="sr-only">
              Filter by genre
            </label>
            <select
              id="genre-select"
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-lg px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
            >
              <option value="all">All Genres</option>
              <option value="business">Business</option>
              <option value="tech">Tech</option>
              <option value="christian">Christian</option>
              <option value="others">Others</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-white/80 dark:bg-slate-800/80 text-gray-500'}`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-white/80 dark:bg-slate-800/80 text-gray-500'}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {books.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No books yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Start adding books to track your reading journey!
            </p>
          </div>
        ) : (
          <>
            {/* Currently Reading */}
            {currentlyReading.length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <BookOpen className="mr-3 text-blue-500" />
                  Currently Reading ({currentlyReading.length})
                </h2>
                <div className={`grid gap-6 ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                  {currentlyReading.map((book) => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </div>
              </section>
            )}

            {/* Want to Read */}
            {wantToRead.length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <Book className="mr-3 text-indigo-500" />
                  Want to Read ({wantToRead.length})
                </h2>
                <div className={`grid gap-6 ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                  {wantToRead.map((book) => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </div>
              </section>
            )}

            {/* Recently Finished */}
            {finished.length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <CheckCircle className="mr-3 text-green-500" />
                  Recently Finished ({finished.length})
                </h2>
                <div className={`grid gap-6 ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                  {finished.map((book) => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-8 shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-4">
            Love Reading Too?
          </h2>
          <p className="text-blue-100 mb-6">
            Check out my thoughts and learnings from these books and more on my Thoughts page
          </p>
          <Link href='/thoughts'>
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200">
              View My Thoughts
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ReadingPage;