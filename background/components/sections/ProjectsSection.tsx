"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FolderSearch } from "lucide-react";
import { projects } from "@/config/projects";
import { getAllTags, filterAndSortProjects, type SortMode } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectFilters } from "@/components/projects/ProjectFilters";
import { ProjectCard } from "@/components/projects/ProjectCard";

export function ProjectsSection() {
  const [query, setQuery] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [sort, setSort] = useState<SortMode>("featured");

  const allTags = useMemo(() => getAllTags(projects), []);

  const filtered = useMemo(
    () => filterAndSortProjects(projects, { query, tags: activeTags, sort }),
    [query, activeTags, sort]
  );

  function toggleTag(tag: string) {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  return (
    <section id="projects" className="relative px-4 py-28 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Selected work"
            title="Projects"
            description="A collection of products I've designed, engineered, and shipped — spanning SaaS, commerce, real-time systems, and interactive 3D."
          />
        </div>

        <div className="mt-10">
          <ProjectFilters
            query={query}
            onQueryChange={setQuery}
            allTags={allTags}
            activeTags={activeTags}
            onToggleTag={toggleTag}
            sort={sort}
            onSortChange={setSort}
          />
        </div>

        <div className="mt-10">
          {filtered.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              <AnimatePresence mode="popLayout">
                {filtered.map((project, index) => (
                  <ProjectCard
                    key={project.name}
                    project={project}
                    priority={index < 2}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-3 rounded-card-lg border border-white/10 bg-white/[0.03] py-20 text-center"
            >
              <FolderSearch size={28} className="text-muted" />
              <p className="text-white">No projects match your search.</p>
              <p className="text-sm text-muted">
                Try a different keyword or clear a filter.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
