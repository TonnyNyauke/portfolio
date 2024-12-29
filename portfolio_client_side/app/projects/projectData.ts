import { ProjectDetails } from './project';

export const projectData: ProjectDetails = {
  title: "Project Title",
  description: "Short project description",
  longDescription: "Detailed project description explaining the challenge, solution, and outcome...",
  image: "/api/placeholder/1200/600",
  technologies: [
    { name: "React" },
    { name: "Next.js" },
    { name: "TypeScript" },
    { name: "Tailwind CSS" }
  ],
  githubUrl: "https://github.com/username/project",
  liveUrl: "https://project-demo.com",
  date: "2024",
  category: "Web Development"
};