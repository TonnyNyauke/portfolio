import { ProjectDetails } from './project';
import file from '../../public/file.svg'

export const projectData: ProjectDetails[] = [
  {
    id: "saas-analytics-dashboard",
    title: "Analytics Dashboard SaaS",
    description: "A comprehensive analytics dashboard for SaaS businesses with real-time data visualization and reporting",
    longDescription: `This analytics dashboard helps SaaS businesses track their key metrics in real-time. The project was built with a focus on performance and scalability.

Key Features:
• Real-time data visualization with WebSocket integration
• Custom dashboard layouts with drag-and-drop functionality
• Advanced filtering and data export capabilities
• Team collaboration features with role-based access control
• Integration with popular SaaS platforms

Technical Challenges:
One of the main challenges was handling real-time updates for multiple users simultaneously while maintaining performance. This was solved using WebSocket connections and efficient data structures for state management.`,
    image: file,
    technologies: [
      { name: "React" },
      { name: "Next.js" },
      { name: "TypeScript" },
      { name: "Tailwind CSS" },
      { name: "Node.js" },
      { name: "WebSocket" },
      { name: "PostgreSQL" }
    ],
    githubUrl: "https://github.com/username/analytics-dashboard",
    liveUrl: "https://analytics-dashboard-demo.com",
    date: "March 2024",
    category: "SaaS Product",
    featured: true
  },
  {
    id: "ai-content-generator",
    title: "AI Content Generator",
    description: "An AI-powered content generation tool that helps creators produce high-quality content efficiently",
    longDescription: `This AI content generator leverages advanced language models to help content creators generate ideas, outlines, and full articles.

Key Features:
• Multiple content types support (blog posts, social media, emails)
• Custom training on brand voice and style
• SEO optimization suggestions
• Content history and versioning
• Export to various formats

Implementation Details:
The system uses a combination of GPT models and custom-trained models for specific content types. The architecture ensures low latency and high availability.`,
    image: "/api/placeholder/1200/600",
    technologies: [
      { name: "Python" },
      { name: "FastAPI" },
      { name: "React" },
      { name: "MongoDB" },
      { name: "Docker" },
      { name: "AWS" }
    ],
    githubUrl: "https://github.com/username/ai-content-generator",
    liveUrl: "https://ai-content-demo.com",
    date: "January 2024",
    category: "AI/ML",
    featured: true
  },
  {
    id: "e-commerce-platform",
    title: "Modern E-commerce Platform",
    description: "A full-featured e-commerce platform with headless CMS integration and advanced payment processing",
    longDescription: `A modern e-commerce platform built with Next.js and integrated with a headless CMS for flexible content management.

Key Features:
• Headless CMS integration for product management
• Advanced search with filtering and faceting
• Real-time inventory management
• Multiple payment gateway support
• Order tracking and management
• Customer account management

Technical Implementation:
The platform uses Next.js for server-side rendering and static generation, improving SEO and performance. The backend is built with Node.js and uses GraphQL for efficient data fetching.`,
    image: "/api/placeholder/1200/600",
    technologies: [
      { name: "Next.js" },
      { name: "GraphQL" },
      { name: "Node.js" },
      { name: "Stripe" },
      { name: "PostgreSQL" },
      { name: "Redis" }
    ],
    githubUrl: "https://github.com/username/ecommerce-platform",
    liveUrl: "https://ecommerce-demo.com",
    date: "December 2023",
    category: "E-commerce",
    featured: true
  },
  {
    id: "realtime-collaboration-tool",
    title: "Real-time Collaboration Tool",
    description: "A collaborative workspace for teams with real-time document editing and project management features",
    longDescription: `This real-time collaboration tool enables teams to work together efficiently with features like simultaneous editing and instant updates.

Key Features:
• Real-time document editing
• Project management tools
• Team chat and video calls
• File sharing and version control
• Integration with popular tools

Technical Highlights:
Implemented operational transformation for conflict-free real-time editing and used WebRTC for peer-to-peer video communications.`,
    image: "/api/placeholder/1200/600",
    technologies: [
      { name: "React" },
      { name: "WebRTC" },
      { name: "Socket.io" },
      { name: "Node.js" },
      { name: "MongoDB" },
      { name: "Docker" }
    ],
    githubUrl: "https://github.com/username/collaboration-tool",
    liveUrl: "https://collab-tool-demo.com",
    date: "November 2023",
    category: "Productivity",
    featured: false
  },
  {
    id: "mobile-fitness-app",
    title: "Mobile Fitness Tracking App",
    description: "A cross-platform mobile app for fitness tracking with social features and AI-powered recommendations",
    longDescription: `A comprehensive fitness tracking application that helps users achieve their fitness goals with personalized recommendations and social support.

Key Features:
• Workout tracking and planning
• AI-powered exercise recommendations
• Social sharing and challenges
• Progress visualization
• Integration with fitness devices
• Nutrition tracking

Technical Details:
Built using React Native for cross-platform compatibility, with a Node.js backend and machine learning models for personalized recommendations.`,
    image: "/api/placeholder/1200/600",
    technologies: [
      { name: "React Native" },
      { name: "Node.js" },
      { name: "TensorFlow" },
      { name: "Firebase" },
      { name: "TypeScript" }
    ],
    githubUrl: "https://github.com/username/fitness-app",
    liveUrl: "https://fitness-app-demo.com",
    date: "October 2023",
    category: "Mobile App",
    featured: false
  },
  {
    id: "blockchain-marketplace",
    title: "NFT Marketplace",
    description: "A decentralized marketplace for trading NFTs with support for multiple blockchains",
    longDescription: `This NFT marketplace enables users to create, buy, and sell NFTs across multiple blockchains with a focus on user experience and security.

Key Features:
• Multi-chain support
• NFT creation and minting
• Auction system
• Wallet integration
• Analytics dashboard
• Social features

Technical Implementation:
Built using Next.js for the frontend and Solidity for smart contracts. Implemented IPFS for decentralized storage and used Web3.js for blockchain interactions.`,
    image: "/api/placeholder/1200/600",
    technologies: [
      { name: "Solidity" },
      { name: "Next.js" },
      { name: "Web3.js" },
      { name: "IPFS" },
      { name: "TypeScript" },
      { name: "Hardhat" }
    ],
    githubUrl: "https://github.com/username/nft-marketplace",
    liveUrl: "https://nft-marketplace-demo.com",
    date: "September 2023",
    category: "Blockchain",
    featured: false
  }
];

// Helper function to get featured projects
export const getFeaturedProjects = () => projectData.filter(project => project.featured);

// Helper function to get project by ID
export const getProjectById = (id: string) => projectData.find(project => project.id === id);

// Helper function to get projects by category
export const getProjectsByCategory = (category: string) => 
  projectData.filter(project => project.category === category);