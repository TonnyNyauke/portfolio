// types/adventure.ts

export interface Adventure {
    id: string
    title: string
    subtitle: string
    description: string
    content: string // Markdown content
    date: string // ISO date string or 'ongoing'
    type: 'Experience' | 'Community' | 'Travel'
    color: string // Tailwind gradient class like 'from-rose-500 to-pink-600'
    icon: string // Icon name like 'Heart', 'Users', 'Compass'
    images: string[] // Array of image paths
    location?: string // Optional location
    status?: 'ongoing' | 'completed' // Optional status
  }
  
  export interface RelatedItem {
    id: string
    title: string
    type: 'adventure' | 'blog'
    date: string
  }
  
  export interface AdventuresResponse {
    adventures: Adventure[]
    success: boolean
    error?: string
  }
  
  export interface AdventureDetailResponse {
    adventure: Adventure
    related: RelatedItem[]
    success: boolean
    error?: string
  }