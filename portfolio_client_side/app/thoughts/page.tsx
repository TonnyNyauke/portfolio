// app/thoughts/page.tsx
import React from 'react';
import type { Metadata } from 'next';
import ThoughtsClientPage from './ThoughtsClient';

// SEO Metadata - ONLY ADDITION
export const metadata: Metadata = {
  title: 'Thoughts & Insights - Tonny Nyauke | Tech, Business & Faith',
  description: 'Read thoughts and insights on SaaS development, entrepreneurship, software engineering, and faith-based business from Tonny Nyauke, founder of Zuriscale.',
  keywords: [
    'tech blog',
    'business insights',
    'SaaS development',
    'entrepreneurship Kenya',
    'software engineering blog',
    'faith and business',
    'startup journey',
    'Tonny Nyauke blog'
  ],
  openGraph: {
    title: 'Thoughts & Insights - Tonny Nyauke',
    description: 'Sharing my journey in tech, business, and faith',
    url: 'https://tonnynyauke.com/thoughts',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Thoughts & Insights - Tonny Nyauke',
    description: 'Sharing my journey in tech, business, and faith',
  },
  alternates: {
    canonical: 'https://tonnynyauke.com/thoughts',
  },
};

// Structured Data - ONLY ADDITION
const blogListJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  name: 'Tonny Nyauke - Thoughts & Insights',
  description: 'Blog about tech, business, and faith',
  url: 'https://tonnynyauke.com/thoughts',
  author: {
    '@type': 'Person',
    name: 'Tonny Blair Nyauke',
  },
};

// Server Component - Just wraps your client component
export default function ThoughtsPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogListJsonLd),
        }}
      />

      {/* Your existing component - fetches data exactly as before */}
      <ThoughtsClientPage />
    </>
  );
}