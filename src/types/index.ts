export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  video?: string;
  tags: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
}

export interface Skill {
  name: string;
  level: number; // 0-100
  category: SkillCategory;
}

export type SkillCategory =
  | "Frontend"
  | "Backend"
  | "Mobile"
  | "UI/UX"
  | "AI"
  | "Cloud"
  | "DevOps"
  | "Databases";

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  logo?: string;
  period: string;
  location: string;
  points: string[];
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface Stat {
  label: string;
  value: number;
  suffix?: string;
}

export interface GithubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
}

export interface ContactFormValues {
  name: string;
  email: string;
  subject: string;
  message: string;
}
