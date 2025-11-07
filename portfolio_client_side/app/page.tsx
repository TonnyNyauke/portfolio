// app/page.tsx
import Adventures from '@/components/Adventures'
import CurrentlyBuilding from '@/components/CurrentlyBuilding'
import Hero from '@/components/Hero'
import ReadingCorner from '@/components/ReadingCorner'
import RecentThoughts from '@/components/RecentThoughts'
import type { Metadata } from 'next'

// Enhanced metadata for homepage
export const metadata: Metadata = {
  title: 'Tonny Nyauke - SaaS Builder, Developer & Entrepreneur in Homa Bay, Kenya',
  description: 'Tonny Nyauke builds SaaS products like Zuriscale for boutique owners. Follow my journey in software development, business growth, and continuous learning from Homa Bay, Kenya.',
  keywords: [
    'Tonny Nyauke',
    'SaaS builder Kenya',
    'software developer Homa Bay',
    'Zuriscale',
    'boutique management software',
    'web developer Kenya',
    'entrepreneur Homa Bay',
    'Christian developer',
    'tech entrepreneur Africa',
    'Next.js developer Kenya'
  ],
  authors: [{ name: 'Tonny Nyauke' }],
  creator: 'Tonny Nyauke',
  publisher: 'Tonny Nyauke',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.tonnynyauke.com',
    siteName: 'Tonny Nyauke',
    title: 'Tonny Nyauke - SaaS Builder & Developer in Homa Bay, Kenya',
    description: 'Building SaaS products, sharing lessons learned, and documenting the journey from idea to product-market fit.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Tonny Nyauke - SaaS Builder & Developer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tonny Nyauke - SaaS Builder & Developer',
    description: 'Building Zuriscale and sharing my journey in SaaS, development, and entrepreneurship.',
    images: ['/og-image.jpg'],
    creator: '@tonnynyauke', // Update with your actual Twitter handle
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://www.tonnynyauke.com',
  },
}

// JSON-LD structured data for better SEO
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Tonny Nyauke',
  jobTitle: 'SaaS Builder & Software Developer',
  description: 'SaaS entrepreneur and software developer building products that help businesses grow',
  url: 'https://www.tonnynyauke.com',
  image: 'https://tonnynyauke.com/profile.png',
  sameAs: [
    'https://twitter.com/tonnynyauke', // Update with your actual social media
    'https://linkedin.com/in/tonnynyauke',
    'https://github.com/TonnyNyauke',
  ],
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Homa Bay',
    addressRegion: 'Homa Bay County',
    addressCountry: 'Kenya',
  },
  knowsAbout: [
    'SaaS Development',
    'Web Development',
    'Entrepreneurship',
    'Customer Experience',
    'Software Engineering',
    'Business Growth',
  ],
  alumniOf: {
    '@type': 'Organization',
    name: 'Moi University School of Engineering, ALX', // Update this
  },
  worksFor: {
    '@type': 'Organization',
    name: 'Zuriscale',
    description: 'SaaS platform for boutique owners',
    url: 'https://www.zuriscale.com',
  },
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Tonny Nyauke',
  url: 'https://www.tonnynyauke.com',
  description: 'Personal website and blog of Tonny Nyauke - SaaS builder, developer, and entrepreneur',
  author: {
    '@type': 'Person',
    name: 'Tonny Nyauke',
  },
  inLanguage: 'en-US',
}

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://www.tonnynyauke.com',
    },
  ],
}

export default function Home() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteJsonLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />

      <main className="min-h-screen bg-slate-50 dark:bg-slate-900">
        {/* Main content with semantic HTML */}
        <Hero />
        
        <article itemScope itemType="https://schema.org/Article">
          <CurrentlyBuilding />
        </article>
        
        <section aria-label="Recent blog posts and thoughts">
          <RecentThoughts />
        </section>
        
        <section aria-label="Current reading list and book notes">
          <ReadingCorner />
        </section>
        
        <section aria-label="Adventures and experiences">
          <Adventures />
        </section>
      </main>
    </>
  )
}