'use client'

//app/reading/[bookId]/page.tsx
import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ChevronRight, Calendar, BookOpen, ArrowLeft, MessageSquare, Clock, TrendingUp } from 'lucide-react';

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
  coverColor: string;
  notes: BookNote[];
}

const BookNotesPage: React.FC = () => {
  const router = useRouter();
  const { bookId } = router.query;

  // In real implementation, fetch this data based on bookId
  // For now, using sample data
  const getBookData = (id: string): Book | null => {
    const books: Record<string, Book> = {
      '12-months-to-1-million': {
        id: '12-months-to-1-million',
        title: '12 Months to $1 Million',
        author: 'Ryan Daniel Moran',
        genre: 'Business',
        currentPage: 87,
        totalPages: 240,
        startDate: '2024-09-01',
        coverColor: 'from-green-400 to-blue-500',
        notes: [
          {
            id: '1',
            page: 23,
            chapter: 'Chapter 2: Choose Your Customer',
            note: 'The biggest mistake entrepreneurs make is falling in love with their product instead of their customer. You need to choose WHO you\'re serving before WHAT you\'re serving them.',
            date: '2024-09-02'
          },
          {
            id: '2',
            page: 45,
            chapter: 'Chapter 3: The Customer Avatar',
            note: 'The concept of "choosing your customer first" before building the product is revolutionary. Most entrepreneurs do it backwards. This reminds me of how I approached Zuriscale - I started with boutique owners\' pain points first.',
            date: '2024-09-05'
          },
          {
            id: '3',
            page: 58,
            chapter: 'Chapter 4: Market Research',
            note: 'Don\'t ask customers what they want - observe what they buy. People lie in surveys but their wallets tell the truth. Need to apply this principle when validating Zuriscale features.',
            date: '2024-09-06'
          },
          {
            id: '4',
            page: 73,
            chapter: 'Chapter 5: The 25-Product Rule',
            note: 'The 25-product rule is interesting - focus on getting 25 sales per day of one product before expanding. This applies perfectly to Zuriscale. I need to get 25 boutique owners paying before I think about other industries.',
            date: '2024-09-10'
          },
          {
            id: '5',
            page: 87,
            chapter: 'Chapter 6: Building Your Brand',
            note: 'Building a business around a lifestyle, not the other way around. This resonates deeply with my vision for Zuriscale - freedom and impact, not just money. The goal is to create something that serves my life, not consumes it.',
            date: '2024-09-15'
          },
          {
            id: '6',
            page: 95,
            chapter: 'Chapter 6: Building Your Brand',
            note: 'Personal brands are built on personal stories. People buy from people, not companies. I need to share more of my journey from broke engineering student to building Zuriscale. That story is my competitive advantage.',
            date: '2024-09-16'
          }
        ]
      },
      'automatic-customers': {
        id: 'automatic-customers',
        title: 'Automatic Customers',
        author: 'John Warrillow',
        genre: 'Business',
        currentPage: 123,
        totalPages: 195,
        startDate: '2024-08-15',
        coverColor: 'from-purple-400 to-pink-500',
        notes: [
          {
            id: '7',
            page: 34,
            chapter: 'Chapter 2: The Subscription Advantage',
            note: 'Subscription businesses are 8x more valuable than traditional businesses. The recurring revenue model is where the magic happens. This is exactly why I\'m building Zuriscale as a SaaS - predictable revenue is everything.',
            date: '2024-08-20'
          },
          {
            id: '8',
            page: 56,
            chapter: 'Chapter 3: The Psychology of Subscriptions',
            note: 'People don\'t cancel subscriptions they forget about. But the goal shouldn\'t be to trick people - it should be to make your service so valuable they never want to cancel. That\'s the Zuriscale standard I\'m aiming for.',
            date: '2024-08-25'
          },
          {
            id: '9',
            page: 89,
            chapter: 'Chapter 5: Measuring Success',
            note: 'The "subscription score" framework - measuring how likely customers are to stay subscribed based on usage patterns, support tickets, and payment history. Need to implement this analytics dashboard for Zuriscale ASAP.',
            date: '2024-09-01'
          },
          {
            id: '10',
            page: 123,
            chapter: 'Chapter 7: Growing Your Base',
            note: 'Customer success is not about preventing churn, it\'s about creating expansion revenue. Instead of just keeping customers, focus on making them buy MORE. Mind = blown 🤯 This changes everything about how I think about Zuriscale\'s pricing tiers.',
            date: '2024-09-12'
          }
        ]
      }
    };

    return books[id as string] || null;
  };

  const book = getBookData(bookId as string);

  if (!book) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Book Not Found</h1>
          <Link href="/reading" className="text-blue-600 dark:text-blue-400 hover:underline">
            ← Back to Reading
          </Link>
        </div>
      </div>
    );
  }

  const getProgressPercentage = (current: number, total: number) => {
    return Math.round((current / total) * 100);
  };

  const progress = getProgressPercentage(book.currentPage, book.totalPages);
  const sortedNotes = book.notes.sort((a, b) => a.page - b.page);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-8">
          <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/reading" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Reading
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 dark:text-white font-medium">
            {book.title} - Notes
          </span>
        </nav>

        {/* Back Button */}
        <Link 
          href="/reading"
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Reading
        </Link>

        {/* Book Header */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Book Cover */}
            <div className={`w-24 h-32 bg-gradient-to-br ${book.coverColor} rounded-lg flex items-end justify-center p-3 shadow-lg flex-shrink-0`}>
              <div className="text-white text-xs font-bold text-center leading-tight">
                {book.title.split(' ').slice(0, 2).join(' ')}
              </div>
            </div>
            
            {/* Book Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {book.title}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
                by {book.author}
              </p>
              
              <div className="flex items-center gap-4 mb-4">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  book.genre === 'Business' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' :
                  book.genre === 'Tech' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                  book.genre === 'Christian' ? 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200' :
                  'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200'
                }`}>
                  {book.genre}
                </span>
                
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span className="text-sm">Started: {new Date(book.startDate).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <span>Reading Progress</span>
                  <span>Page {book.currentPage} of {book.totalPages} ({progress}%)</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full bg-gradient-to-r ${book.coverColor}`}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-500 mb-1">{book.notes.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Notes</div>
          </div>
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-500 mb-1">{book.currentPage}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Pages Read</div>
          </div>
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-purple-500 mb-1">{Math.round(book.notes.length / (book.currentPage / 10))}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Notes per 10 pages</div>
          </div>
        </div>

        {/* Notes Section */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <MessageSquare className="mr-3 text-blue-500" />
            Reading Notes & Insights
          </h2>

          <div className="space-y-6">
            {sortedNotes.map((note, index) => (
              <div key={note.id} className="border-l-4 border-blue-500 pl-6 py-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                      <BookOpen className="w-3 h-3 mr-1" />
                      Page {note.page}
                    </span>
                    {note.chapter && (
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {note.chapter}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                    <Clock className="w-4 h-4 mr-1" />
                    {new Date(note.date).toLocaleDateString()}
                  </div>
                </div>
                
                <blockquote className="text-gray-800 dark:text-gray-200 leading-relaxed text-base italic">
                  "{note.note}"
                </blockquote>
                
                {index < sortedNotes.length - 1 && (
                  <hr className="mt-6 border-gray-200 dark:border-gray-700" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Related Thoughts CTA */}
        <div className="mt-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 shadow-xl text-center">
          <h3 className="text-xl font-bold text-white mb-2">
            Found These Notes Interesting?
          </h3>
          <p className="text-blue-100 mb-4">
            Check out my detailed thoughts and how I'm applying these concepts to Zuriscale
          </p>
          <Link 
            href="/thoughts"
            className="inline-flex items-center bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            View My Thoughts
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookNotesPage;