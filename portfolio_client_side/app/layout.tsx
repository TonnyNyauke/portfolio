import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// SEO Metadata
export const metadata: Metadata = {
  metadataBase: new URL('https://www.tonnynyauke.com'),
  title: {
    default: 'Tonny Nyauke | Fullstack JavaScript Developer & Zuriscale Founder',
    template: '%s | Tonny Nyauke'
  },
  description: 'Fullstack JavaScript Engineer specializing in Next.js, Node.js, and React. Founder of Zuriscale, helping boutique owners turn one-time customers into repeat buyers through automated WhatsApp marketing.',
  keywords: [
    'Tonny Nyauke',
    'Fullstack Developer',
    'JavaScript Engineer',
    'Next.js Developer',
    'React Developer',
    'Node.js Developer',
    'Zuriscale',
    'Web Developer Kenya',
    'Software Engineer Homa Bay',
    'Freelance Developer',
    'TypeScript Developer',
    'Tailwind CSS',
    'Supabase',
    'WhatsApp Marketing Automation',
    'E-commerce Solutions',
    'Boutique Software'
  ],
  authors: [{ name: 'Tonny Blair Nyauke' }],
  creator: 'Tonny Blair Nyauke',
  publisher: 'Tonny Blair Nyauke',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_KE',
    url: 'https://www.tonnynyauke.com',
    siteName: 'Tonny Nyauke',
    title: 'Tonny Nyauke | Fullstack JavaScript Developer & Zuriscale Founder',
    description: 'Fullstack JavaScript Engineer specializing in Next.js, Node.js, and React. Building Zuriscale to help boutique owners grow their businesses.',
    images: [
      {
        url: '/og-image.jpg', // Create this image (1200x630px)
        width: 1200,
        height: 630,
        alt: 'Tonny Nyauke - Fullstack Developer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tonny Nyauke | Fullstack JavaScript Developer',
    description: 'Fullstack JavaScript Engineer building innovative web solutions with Next.js, React, and Node.js',
    images: ['/og-image.jpg'],
    creator: '@tonnynyauke', // Add your Twitter handle if you have one
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
  verification: {
    // Add these after setting up in Google Search Console and Bing Webmaster Tools
    // google: 'your-google-verification-code',
    // bing: 'your-bing-verification-code',
  },
  alternates: {
    canonical: 'https://www.tonnynyauke.com',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* JSON-LD Structured Data for Person */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Tonny Blair Nyauke",
              url: "https://www.tonnynyauke.com",
              image: "https://www.tonnynyauke.com/profile.png",
              jobTitle: "Fullstack JavaScript Developer",
              worksFor: {
                "@type": "Organization",
                name: "Zuriscale"
              },
              sameAs: [
                "https://www.linkedin.com/in/tonnynyauke/",
                "https://www.instagram.com/nyauke_industries/",
                "https://github.com/TonnyNyauke" // Add if you have GitHub
              ],
              address: {
                "@type": "PostalAddress",
                addressLocality: "Homa Bay",
                addressRegion: "Homa Bay County",
                addressCountry: "KE"
              },
              knowsAbout: [
                "Next.js",
                "React",
                "Node.js",
                "TypeScript",
                "JavaScript",
                "Tailwind CSS",
                "Web Development",
                "Fullstack Development"
              ]
            })
          }}
        />

        {/* JSON-LD Structured Data for Website */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Tonny Nyauke",
              url: "https://www.tonnynyauke.com",
              description: "Personal website of Tonny Nyauke, Fullstack JavaScript Developer and Zuriscale Founder",
              author: {
                "@type": "Person",
                name: "Tonny Blair Nyauke"
              },
              inLanguage: "en-US"
            })
          }}
        />

        {/* JSON-LD Structured Data for Professional Service */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              name: "Tonny Nyauke - Fullstack Development Services",
              url: "https://tonnynyauke.com",
              description: "Freelance fullstack JavaScript development services specializing in Next.js, React, and Node.js",
              priceRange: "$$",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Homa Bay",
                addressRegion: "Homa Bay County",
                addressCountry: "KE"
              },
              areaServed: {
                "@type": "Country",
                name: "Kenya"
              },
              serviceType: [
                "Web Development",
                "Fullstack Development",
                "Frontend Development",
                "Backend Development",
                "Software Development"
              ]
            })
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        
        <Header />
        <Analytics />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}