"use client";

import { motion } from "framer-motion";
import { GitFork, Github, Star } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { FloatingOrbs } from "@/components/motion/FloatingOrbs";
import { SectionHeading } from "@/components/motion/SectionHeading";
import { SITE } from "@/lib/data";
import type { GithubRepo } from "@/types";

interface GithubData {
  repos: GithubRepo[];
  totalStars: number;
  totalRepos: number;
  languages: Record<string, number>;
  contributions: { total: number; days: { date: string; count: number }[] } | null;
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3B82F6",
  JavaScript: "#06B6D4",
  Python: "#8B5CF6",
  Rust: "#f97316",
  Go: "#22d3ee",
  CSS: "#ec4899",
  HTML: "#f59e0b",
  Swift: "#f43f5e",
};

/** Deterministic placeholder grid shown until real contribution data is wired up. */
function placeholderDays(weeks = 26) {
  const days: number[] = [];
  for (let i = 0; i < weeks * 7; i++) {
    const wave = Math.sin(i / 5) + Math.sin(i / 13);
    days.push(Math.max(0, Math.round(wave * 2 + (i % 7 === 0 ? 1 : 0))));
  }
  return days;
}

function ContributionGraph({ data }: { data: GithubData["contributions"] }) {
  const cells = useMemo(() => {
    if (data?.days?.length) return data.days.map((d) => d.count);
    return placeholderDays();
  }, [data]);

  const max = Math.max(...cells, 1);

  return (
    <div className="overflow-x-auto pb-2">
      <div className="grid grid-flow-col grid-rows-7 gap-1 min-w-max">
        {cells.map((count, i) => {
          const intensity = count / max;
          return (
            <motion.span
              key={i}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.3, delay: (i % 52) * 0.006 }}
              className="h-3 w-3 rounded-sm flex-shrink-0"
              style={{
                backgroundColor:
                  intensity === 0
                    ? "rgba(255,255,255,0.05)"
                    : `rgba(59,130,246,${0.25 + intensity * 0.75})`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

export function GithubSection() {
  const [data, setData] = useState<GithubData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/github")
      .then((res) => res.json())
      .then((json) => {
        if (json.error) setError(json.error);
        else setData(json);
      })
      .catch(() => setError("Couldn't reach the GitHub API."));
  }, []);

  const languageEntries = Object.entries(data?.languages ?? {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);
  const languageTotal = languageEntries.reduce((sum, [, v]) => sum + v, 0) || 1;

  return (
    <section id="github" className="relative mx-auto max-w-6xl px-6 py-28 sm:py-36">
      <FloatingOrbs seed={7} count={2} />

      <SectionHeading
        eyebrow="Open Source"
        title="Life on GitHub"
        accent="electric"
        className={error ? "mb-6" : undefined}
      />
      {error && (
        <p className="mx-auto mb-16 max-w-md text-center font-body text-xs text-white/35">
          Showing placeholder data — set NEXT_PUBLIC_GITHUB_USERNAME (and
          optionally GITHUB_TOKEN) in your environment to pull your real stats.
        </p>
      )}

      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="rounded-3xl border border-glass-border bg-white/[0.02] p-6 backdrop-blur-xl sm:p-8"
        >
          <div className="mb-6 flex items-center justify-between">
            <h3 className="font-display text-sm font-medium text-white/70">
              Contribution activity
            </h3>
            <span className="font-body text-xs text-white/40">
              {data?.contributions?.total ?? "~1,200"} contributions
            </span>
          </div>
          <ContributionGraph data={data?.contributions ?? null} />

          {languageEntries.length > 0 && (
            <div className="mt-8">
              <h3 className="mb-3 font-display text-sm font-medium text-white/70">
                Most used languages
              </h3>
              <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-white/5">
                {languageEntries.map(([lang, bytes]) => (
                  <span
                    key={lang}
                    style={{
                      width: `${(bytes / languageTotal) * 100}%`,
                      backgroundColor: LANGUAGE_COLORS[lang] ?? "#64748b",
                    }}
                  />
                ))}
              </div>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
                {languageEntries.map(([lang, bytes]) => (
                  <span key={lang} className="flex items-center gap-1.5 font-body text-xs text-white/45">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: LANGUAGE_COLORS[lang] ?? "#64748b" }}
                    />
                    {lang} · {((bytes / languageTotal) * 100).toFixed(0)}%
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="grid grid-cols-2 gap-4"
        >
          {[
            { label: "Public Repos", value: data?.totalRepos ?? "—" },
            { label: "Total Stars", value: data?.totalStars ?? "—" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-glass-border bg-white/[0.02] p-5 text-center backdrop-blur-xl">
              <span className="block font-display text-3xl font-semibold text-white">{s.value}</span>
              <span className="mt-1 block font-body text-xs text-white/45">{s.label}</span>
            </div>
          ))}
          <a
            href={SITE.github}
            target="_blank"
            rel="noreferrer"
            data-cursor="hover"
            className="col-span-2 flex items-center justify-center gap-2 rounded-2xl border border-glass-border bg-white/[0.02] py-4 font-body text-sm text-white/70 transition-colors hover:text-white"
          >
            <Github className="h-4 w-4" /> View full profile
          </a>
        </motion.div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(data?.repos ?? []).slice(0, 6).map((repo, i) => (
          <motion.a
            key={repo.id}
            href={repo.html_url}
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
            data-cursor="hover"
            className="group rounded-2xl border border-glass-border bg-white/[0.02] p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-electric/40 hover:shadow-glow"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-display text-sm font-semibold text-white group-hover:text-electric">
                {repo.name}
              </h4>
              {repo.language && (
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: LANGUAGE_COLORS[repo.language] ?? "#64748b" }}
                />
              )}
            </div>
            <p className="mt-2 line-clamp-2 font-body text-xs text-white/45">
              {repo.description ?? "No description provided."}
            </p>
            <div className="mt-4 flex items-center gap-4 font-body text-xs text-white/40">
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3" /> {repo.stargazers_count}
              </span>
              <span className="flex items-center gap-1">
                <GitFork className="h-3 w-3" /> {repo.forks_count}
              </span>
            </div>
          </motion.a>
        ))}
        {!data?.repos?.length && !error &&
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-32 animate-pulse rounded-2xl border border-glass-border bg-white/[0.02] flex items-center justify-center"
            >
              <span className="font-body text-xs text-white/30">Loading repositories...</span>
            </div>
          ))}
        {!data?.repos?.length && error &&
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-32 rounded-2xl border border-glass-border bg-white/[0.02] flex items-center justify-center"
            >
              <span className="font-body text-xs text-white/30">Unable to load repositories</span>
            </div>
          ))}
      </div>
    </section>
  );
}
