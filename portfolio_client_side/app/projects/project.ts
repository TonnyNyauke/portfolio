export interface Technology {
    name: string;
    icon?: string;
  }
  
  export interface ProjectDetails {
    id: string,
    title: string;
    description: string;
    longDescription: string;
    image: string;
    technologies: Technology[];
    githubUrl?: string;
    liveUrl?: string;
    date: string;
    category: string;
    featured: boolean
  }