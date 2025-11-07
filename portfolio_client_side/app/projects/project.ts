import { StaticImageData } from "next/image";

//app/projects/project.ts
export interface Technology {
  name: string;
  icon?: string;
}

export interface ProjectDetails {
  id: string,
  title: string;
  description: string;
  longDescription: string;
  image: StaticImageData | string;
  technologies: Technology[];
  date?: string;
  githubUrl?: string;
  liveUrl?: string;
  category: string;
  featured: boolean
}