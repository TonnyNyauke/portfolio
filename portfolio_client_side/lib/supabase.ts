import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
// These environment variables should be set in your .env.local file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export type Database = {
  public: {
    Tables: {
      blogs: {
        Row: {
          id: string
          title: string
          category: 'Business' | 'Tech' | 'Faith' | 'Others' | null
          excerpt: string
          content: string
          date: string
          read_time: string
          tags: string[]
          featured: boolean
          views: number | null
          cover_image: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          category?: 'Business' | 'Tech' | 'Faith' | 'Others' | null
          excerpt: string
          content: string
          date?: string
          read_time?: string
          tags?: string[]
          featured?: boolean
          views?: number | null
          cover_image?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          category?: 'Business' | 'Tech' | 'Faith' | 'Others' | null
          excerpt?: string
          content?: string
          date?: string
          read_time?: string
          tags?: string[]
          featured?: boolean
          views?: number | null
          cover_image?: string | null
          updated_at?: string
        }
      }
      adventures: {
        Row: {
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
          location: string | null
          status: 'ongoing' | 'completed' | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          subtitle: string
          description: string
          content: string
          date?: string
          type?: 'Experience' | 'Community' | 'Travel'
          color?: string
          icon?: string
          images?: string[]
          location?: string | null
          status?: 'ongoing' | 'completed' | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          subtitle?: string
          description?: string
          content?: string
          date?: string
          type?: 'Experience' | 'Community' | 'Travel'
          color?: string
          icon?: string
          images?: string[]
          location?: string | null
          status?: 'ongoing' | 'completed' | null
          updated_at?: string
        }
      }
      books: {
        Row: {
          id: string
          title: string
          author: string
          genre: 'Business' | 'Tech' | 'Christian' | 'Others'
          current_page: number
          total_pages: number
          start_date: string
          status: 'currently-reading' | 'finished' | 'want-to-read'
          cover_color: string | null
          rating: number | null
          thoughts: string | null
          review: string | null
          notes: any // JSONB type
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          author: string
          genre?: 'Business' | 'Tech' | 'Christian' | 'Others'
          current_page?: number
          total_pages?: number
          start_date?: string
          status?: 'currently-reading' | 'finished' | 'want-to-read'
          cover_color?: string | null
          rating?: number | null
          thoughts?: string | null
          review?: string | null
          notes?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          author?: string
          genre?: 'Business' | 'Tech' | 'Christian' | 'Others'
          current_page?: number
          total_pages?: number
          start_date?: string
          status?: 'currently-reading' | 'finished' | 'want-to-read'
          cover_color?: string | null
          rating?: number | null
          thoughts?: string | null
          review?: string | null
          notes?: any
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          title: string
          description: string
          long_description: string
          image: string | null
          technologies: any // JSONB type
          date: string | null
          github_url: string | null
          live_url: string | null
          category: string
          featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string
          long_description?: string
          image?: string | null
          technologies?: any
          date?: string | null
          github_url?: string | null
          live_url?: string | null
          category?: string
          featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          long_description?: string
          image?: string | null
          technologies?: any
          date?: string | null
          github_url?: string | null
          live_url?: string | null
          category?: string
          featured?: boolean
          updated_at?: string
        }
      }
    }
  }
}

