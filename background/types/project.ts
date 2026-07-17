/**
 * Shape of a single project entry.
 *
 * This is the ONLY contract you need to respect when adding projects.
 * See `config/projects.ts` — that is the single file you edit day to day.
 */
export interface Project {
  /** Display name of the project. */
  name: string;
  /** Live URL the card and "Visit" affordance link out to. */
  url: string;
  /** Path to a small square logo/mark, e.g. "/icons/my-project.svg". */
  icon: string;
  /** Path to a preview image (ideally ~16:10), e.g. "/images/my-project.svg". */
  image: string;
  /** One or two sentence description shown on the card. */
  description: string;
  /** Technology badges, e.g. ["React", "Next.js", "TypeScript"]. */
  tags: string[];
  /** Optional — set true to feature this project in a larger card. */
  featured?: boolean;
}
