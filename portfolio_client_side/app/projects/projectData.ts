import { ProjectDetails } from './project';
import kedevries from '../../public/kedevries.png'
import profia from '../../public/profia.png'
import rural from '../../public/rural.png'
import zuriscale from '../../public/zuriscale.png'
import hypebuzz from '../../public/hypebuzz.png'

export const projectData: ProjectDetails[] = [
  {
    id: "hypebuzz-kenya",
    title: "HypeBuzz Kenya",
    description: "Kenya's leading event ticketing platform - Fast, secure ticketing for concerts, conferences, and experiences with 60-second checkout",
    longDescription: `HypeBuzz Kenya is a modern event ticketing platform revolutionizing how Kenyans discover and attend events. The platform enables seamless ticket purchasing for concerts, conferences, and various experiences across Kenya.

Key Features:
• 60-second checkout process with MPesa and card payments
• Digital QR code ticket generation and validation
• Real-time event discovery and browsing
• Mobile-first responsive design
• Instagram integration with 14,000+ community members
• Secure payment processing
• Instant ticket delivery via email

Technical Implementation:
• Admin dashboard for event organizers to create and manage events
• Real-time ticket inventory management
• QR code generation and scanning system for event entry
• Payment gateway integration (MPesa and card processing)
• Email notification system for ticket delivery
• Image optimization and CDN integration
• Supabase backend for scalable data management

Business Impact:
Successfully serving 14,000+ users in Kenya's event community, providing a trusted and efficient ticketing solution that has streamlined event access across the country. The platform has become a go-to solution for event organizers and attendees alike.

Technical Challenges:
• Building a secure and fast payment processing system
• Implementing reliable QR code generation and validation
• Designing scalable database architecture for high-traffic events
• Optimizing for mobile users in varying network conditions
• Creating an intuitive admin interface for event management`,
    image: hypebuzz,
    technologies: [
      { name: "Next.js" },
      { name: "TypeScript" },
      { name: "Tailwind CSS" },
      { name: "Shadcn/ui" },
      { name: "Supabase" },
      { name: "MPesa API" },
      { name: "QR Code Generation" }
    ],
    liveUrl: "https://www.hypebuzzke.com",
    category: "Client Work",
    featured: true
  },
  {
    id: "zuriscale-saas",
    title: "Zuriscale",
    description: "SaaS platform helping boutique owners boost revenue through WhatsApp customer retention strategies",
    longDescription: `Zuriscale is my flagship SaaS product designed to help boutique owners increase revenue through strategic WhatsApp customer retention and engagement.

Key Features:
• Real-time analytics dashboard
• WhatsApp integration for customer retention
• Multiple subscription tiers (Basic, Standard, Pro)
• Customer engagement automation
• Revenue tracking and insights
• SEO-optimized platform

Technical Challenges:
• Building real-time analytics architecture
• Designing scalable database for three subscription models
• WebSocket implementation for live data updates
• Enterprise-grade database architecture that accommodates future changes

Business Challenges:
Beyond technical implementation, this project encompasses the full startup experience including marketing strategy, customer acquisition, web analytics, team building, and business development. It's been an interesting learning journey covering both technical and entrepreneurial aspects.`,
    image: zuriscale,
    technologies: [
      { name: "Next.js" },
      { name: "Node.js" },
      { name: "TypeScript" },
      { name: "Tailwind CSS" },
      { name: "Shadcn/ui" },
      { name: "WebSocket" },
      { name: "Supabase" },
      { name: "Firebase" }
    ],
    liveUrl: "https://www.zuriscale.com",
    category: "Personal Work",
    featured: true
  },
  {
    id: "profia-institute",
    title: "Profia Institute of Professionals",
    description: "A comprehensive education platform featuring student portal and e-learning capabilities for professional development",
    longDescription: `A full-scale education platform for Profia Institute of Professionals, designed to deliver professional development courses and manage student interactions.

Key Features:
• Student portal web application similar to college institution platforms
• E-learning platform comparable to Udemy for course delivery
• Admin platform for course and student management
• Client platform for institutional oversight
• SEO optimization including sitemaps, robots file, and indexing

Technical Challenges:
Building an enterprise-grade database architecture that scales with growing user base while maintaining performance and data integrity across multiple platform components.`,
    image: profia,
    technologies: [
      { name: "Next.js" },
      { name: "TypeScript" },
      { name: "Node.js" },
      { name: "Supabase" },
      { name: "Shadcn/ui" },
      { name: "Tailwind CSS" }
    ],
    liveUrl: "https://profiainstitute.com",
    category: "Client Work",
    featured: true
  },
  {
    id: "rural-digital-kenya",
    title: "Rural Digital Kenya Website",
    description: "A donor-focused website for a non-profit organization bringing digital skills to rural Kenya",
    longDescription: `A strategically designed website for Rural Digital Kenya, a non-profit organization focused on bringing digital skills to rural areas in Kenya. The website was specifically designed with donors in mind and has successfully achieved its purpose of attracting funding.

Key Features:
• Donor-centric design and user experience
• Partnership integration with Profia Institute of Professionals
• Mission-driven content presentation
• Payment integration with Intasend (in progress)
• SEO optimization for maximum visibility

Project Impact:
The website has successfully fulfilled its primary objective of attracting donors and supporting the organization's mission to bridge the digital divide in rural Kenya.`,
    image: rural,
    technologies: [
      { name: "Next.js" },
      { name: "TypeScript" },
      { name: "Tailwind CSS" },
      { name: "Shadcn/ui" },
      { name: "Intasend" }
    ],
    liveUrl: "https://www.ruraldigitalkenya.org",
    category: "Client Work",
    featured: true
  },
  {
    id: "kedevries-farm",
    title: "Kedevries Farm Website",
    description: "Complete website redesign for an agricultural services company, transforming poor WordPress implementation into modern, fast platform",
    longDescription: `A complete website redesign and rebuild for Kedevries Farm, transforming their agricultural services platform from a poorly implemented WordPress site into a modern, high-performance web application.

Key Features:
• Complete UI/UX redesign focused on target users (donors and farmers)
• Agricultural services showcase and information platform
• Donor engagement and conversion optimization
• SEO optimization for improved visibility
• Mobile-responsive design

Technical Improvements:
• Migration from WordPress to Next.js for better performance
• Server-side rendering (SSR) implementation
• Significant speed improvements
• Enhanced SEO capabilities
• Modern responsive design

Client Feedback:
The client was extremely pleased with the work, stating it exceeded expectations and was superior to work done by developers in Nairobi.`,
    image: kedevries,
    technologies: [
      { name: "Next.js" },
      { name: "TypeScript" },
      { name: "Tailwind CSS" },
      { name: "Shadcn/ui" }
    ],
    liveUrl: "https://kedevriesfarm.org",
    category: "Client Work",
    featured: true
  },
];

// Helper function to get featured projects
export const getFeaturedProjects = () => projectData.filter(project => project.featured);

// Helper function to get project by ID
export const getProjectById = (id: string) => projectData.find(project => project.id === id);

// Helper function to get projects by category
export const getProjectsByCategory = (category: string) => 
  projectData.filter(project => project.category === category);