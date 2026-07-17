import {
  getStats,
  getSkills,
  getProjects,
  getExperience,
  getServices,
  siteConfig,
} from "@/config/site";

export const SITE = siteConfig;

export const STATS = getStats();
export const SKILLS = getSkills();
export const PROJECTS = getProjects();
export const EXPERIENCE = getExperience();
export const SERVICES = getServices();