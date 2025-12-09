// This file is kept only for type exports
// All API operations have been consolidated to /api/blogs

export type Blog = {
  id: string;
  title: string;
  category?: 'Business' | 'Tech' | 'Faith' | 'Others';
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  tags: string[];
  featured: boolean;
  views?: number;
  coverImage?: string;
};


