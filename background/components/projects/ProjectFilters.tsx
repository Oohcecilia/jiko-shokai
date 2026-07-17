"use client";

import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SortMode } from "@/lib/utils";

interface ProjectFiltersProps {
  query: string;
  onQueryChange: (value: string) => void;
  allTags: string[];
  activeTags: string[];
  onToggleTag: (tag: string) => void;
  sort: SortMode;
  onSortChange: (mode: SortMode) => void;
}

export function ProjectFilters({
  query,
  onQueryChange,
  allTags,
  activeTags,
  onToggleTag,
  sort,
  onSortChange,
}: ProjectFiltersProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label htmlFor="project-search" className="sr-only">
          Search projects
        </label>
        <div className="relative w-full sm:max-w-xs">
          <Search
            size={16}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            id="project-search"
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search projects…"
            className="w-full rounded-full border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-muted/70 outline-none backdrop-blur-sm transition-colors focus:border-accent/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          />
        </div>

        <div
          role="group"
          aria-label="Sort projects"
          className="flex items-center gap-1 self-start rounded-full border border-white/10 bg-white/5 p-1 text-sm"
        >
          {(
            [
              { key: "featured" as SortMode, label: "Featured" },
              { key: "az" as SortMode, label: "A–Z" },
            ]
          ).map((option) => (
            <button
              key={option.key}
              type="button"
              aria-pressed={sort === option.key}
              onClick={() => onSortChange(option.key)}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                sort === option.key
                  ? "bg-gradient-to-r from-primary to-secondary text-white"
                  : "text-muted hover:text-white"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div
        role="group"
        aria-label="Filter by technology"
        className="flex flex-wrap items-center gap-2"
      >
        <button
          type="button"
          aria-pressed={activeTags.length === 0}
          onClick={() => activeTags.forEach((t) => onToggleTag(t))}
          className={cn(
            "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
            activeTags.length === 0
              ? "border-accent/40 bg-accent/10 text-accent"
              : "border-white/10 bg-white/5 text-muted hover:text-white"
          )}
        >
          All
        </button>
        {allTags.map((tag) => {
          const active = activeTags.includes(tag);
          return (
            <button
              key={tag}
              type="button"
              aria-pressed={active}
              onClick={() => onToggleTag(tag)}
              className={cn(
                "inline-flex items-center gap-1 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                active
                  ? "border-accent/40 bg-accent/10 text-accent"
                  : "border-white/10 bg-white/5 text-muted hover:text-white"
              )}
            >
              {tag}
              {active && <X size={11} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
