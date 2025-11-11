// app/thoughts/[id]/page.tsx
import type { Metadata } from 'next';
import ThoughtDetailClient from './ThoughtDetailClient';

interface PageProps {
  params: { id: string };
}

// Dynamic Metadata Generation (for SEO)
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    // Fetch from your API to get metadata
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/blogs/${params.id}`, { cache: 'no-store' });
    
    if (!res.ok) {
      return {
        title: 'Thought Not Found - Tonny Nyauke',
      };
    }

    const data = await res.json();
    const thought = data.blog;

    return {
      title: `${thought.title} - Tonny Nyauke`,
      description: thought.excerpt,
      keywords: [...thought.tags, thought.category, 'Tonny Nyauke', 'blog'],
      authors: [{ name: 'Tonny Blair Nyauke' }],
      openGraph: {
        title: thought.title,
        description: thought.excerpt,
        url: `https://tonnynyauke.com/thoughts/${thought.id}`,
        type: 'article',
        publishedTime: thought.date,
        authors: ['Tonny Blair Nyauke'],
        tags: thought.tags,
        images: thought.coverImage ? [
          {
            url: thought.coverImage,
            width: 1200,
            height: 630,
            alt: thought.title,
          }
        ] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: thought.title,
        description: thought.excerpt,
        images: thought.coverImage ? [thought.coverImage] : [],
      },
      alternates: {
        canonical: `https://tonnynyauke.com/thoughts/${thought.id}`,
      },
    };
  } catch (error) {
    return {
      title: 'Thought Not Found - Tonny Nyauke',
    };
  }
}

// Server Component wrapper (adds structured data only)
export default function ThoughtDetailPage({ params }: PageProps) {
  // Article Structured Data - will be populated by client after fetch
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    author: {
      '@type': 'Person',
      name: 'Tonny Blair Nyauke',
      url: 'https://tonnynyauke.com/about',
    },
    publisher: {
      '@type': 'Person',
      name: 'Tonny Blair Nyauke',
      url: 'https://tonnynyauke.com',
    },
  };

  // Breadcrumb Schema
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://tonnynyauke.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Thoughts',
        item: 'https://tonnynyauke.com/thoughts',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Article',
        item: `https://tonnynyauke.com/thoughts/${params.id}`,
      },
    ],
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleJsonLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />

      {/* Your existing component - uses YOUR fetch pattern */}
      <ThoughtDetailClient />
    </>
  );
}