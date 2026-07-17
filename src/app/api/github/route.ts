import { NextResponse } from "next/server";
import type { GithubRepo } from "@/types";

export const revalidate = 3600; // re-fetch at most once an hour

const USERNAME = process.env.GITHUB_USERNAME ?? process.env.NEXT_PUBLIC_GITHUB_USERNAME;
const TOKEN = process.env.GITHUB_TOKEN; // optional, server-only — never exposed to the client

interface ContributionDay {
  date: string;
  count: number;
}

async function fetchRepos(): Promise<GithubRepo[]> {
  const res = await fetch(
    `https://api.github.com/users/${USERNAME}/repos?sort=updated&per_page=100`,
    {
      headers: TOKEN
        ? { Authorization: `Bearer ${TOKEN}`, Accept: "application/vnd.github+json" }
        : { Accept: "application/vnd.github+json" },
      next: { revalidate: 3600 },
    }
  );
  if (!res.ok) throw new Error(`GitHub REST error: ${res.status}`);
  return res.json();
}

async function fetchLanguages(repos: GithubRepo[]): Promise<Record<string, number>> {
  const top = [...repos]
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 8);

  const totals: Record<string, number> = {};
  await Promise.all(
    top.map(async (repo) => {
      try {
        const url = `https://api.github.com/repos/${USERNAME}/${repo.name}/languages`;
        const res = await fetch(url, {
          headers: TOKEN
            ? { Authorization: `Bearer ${TOKEN}` }
            : undefined,
          next: { revalidate: 3600 },
        });
        if (!res.ok) return;
        const data: Record<string, number> = await res.json();
        for (const [lang, bytes] of Object.entries(data)) {
          totals[lang] = (totals[lang] ?? 0) + bytes;
        }
      } catch {
        // Ignore individual repo language failures — the aggregate still renders.
      }
    })
  );
  return totals;
}

/**
 * The GitHub contribution calendar is only exposed via the authenticated
 * GraphQL API, so this is skipped entirely unless a GITHUB_TOKEN
 * (a fine-grained PAT with no special scopes needed for public data) is
 * present in the server environment. Without it, the client falls back
 * to a stylized illustrative graph.
 */
async function fetchContributionCalendar(): Promise<{ total: number; days: ContributionDay[] } | null> {
  if (!TOKEN || !USERNAME) return null;

  const query = `
    query($login: String!) {
      user(login: $login) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
              }
            }
          }
        }
      }
    }
  `;

  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables: { login: USERNAME } }),
    next: { revalidate: 3600 },
  });

  if (!res.ok) return null;
  const json = await res.json();
  const calendar = json?.data?.user?.contributionsCollection?.contributionCalendar;
  if (!calendar) return null;

  const days: ContributionDay[] = calendar.weeks.flatMap(
    (week: { contributionDays: { date: string; contributionCount: number }[] }) =>
      week.contributionDays.map((d) => ({ date: d.date, count: d.contributionCount }))
  );

  return { total: calendar.totalContributions, days };
}

export async function GET() {
  if (!USERNAME) {
    return NextResponse.json(
      { error: "Set NEXT_PUBLIC_GITHUB_USERNAME in your environment." },
      { status: 400 }
    );
  }

  try {
    const repos = await fetchRepos();
    const [languages, contributions] = await Promise.all([
      fetchLanguages(repos),
      fetchContributionCalendar(),
    ]);

    const topRepos = [...repos]
      .filter((r) => !r.name.includes(`${USERNAME}.github.io`))
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 6);

    const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);

    return NextResponse.json({
      repos: topRepos,
      totalStars,
      totalRepos: repos.length,
      languages,
      contributions,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown GitHub API error" },
      { status: 502 }
    );
  }
}
