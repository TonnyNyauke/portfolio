export interface Technology {
    name: string;
    icon?: string;
  }
  
  export interface ProjectDetails {
    id: string;  // Make id required
    title: string;
    description: string;
    longDescription: string;
    image: string;
    githubUrl: string;
    liveUrl: string;
    category: string;
    technologies: Technology[];
    featured: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }