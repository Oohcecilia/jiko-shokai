import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Project } from "@/types/project";

/** Merge Tailwind class names safely, resolving conflicts. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Collect a unique, alphabetically-sorted list of tags across all projects. */
export function getAllTags(projects: Project[]): string[] {
  const set = new Set<string>();
  projects.forEach((p) => p.tags.forEach((t) => set.add(t)));
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

export type SortMode = "featured" | "az";

interface FilterOptions {
  query: string;
  tags: string[];
  sort: SortMode;
}

/** Filter by search text + selected tags, then sort. Pure + memo-friendly. */
export function filterAndSortProjects(
  projects: Project[],
  { query, tags, sort }: FilterOptions
): Project[] {
  const q = query.trim().toLowerCase();

  let result = projects.filter((p) => {
    const matchesQuery =
      q.length === 0 ||
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q));

    const matchesTags =
      tags.length === 0 || tags.every((t) => p.tags.includes(t));

    return matchesQuery && matchesTags;
  });

  if (sort === "az") {
    result = [...result].sort((a, b) => a.name.localeCompare(b.name));
  } else {
    // "featured" sort: featured projects first, original order preserved otherwise
    result = [...result].sort((a, b) => {
      const fa = a.featured ? 1 : 0;
      const fb = b.featured ? 1 : 0;
      return fb - fa;
    });
  }

  return result;
}
