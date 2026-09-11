import type { Repository, ScopedToken } from "@/lib/types";

const VISIBLE_PREFIX = 4;
const VISIBLE_SUFFIX = 4;
const MASK_LENGTH = 28;

/** Renders a secret the way the dashboard does: `4236••••••••f9ed`. */
export function maskSecret(secret: string): string {
  const prefix = secret.slice(0, VISIBLE_PREFIX);
  const suffix = secret.slice(-VISIBLE_SUFFIX);

  return `${prefix}${"•".repeat(MASK_LENGTH)}${suffix}`;
}

/**
 * Generates a demo secret. A real implementation issues the value server side
 * and never lets the browser mint one.
 */
export function generateSecret(prefix: string): string {
  const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
  const body = Array.from(
    { length: 32 },
    () => alphabet[Math.floor(Math.random() * alphabet.length)],
  ).join("");

  return `${prefix}_${body}`;
}

/** `owner/name`, the form both GitHub and GitLab use to identify a repository. */
export function repositorySlug(repository: Repository): string {
  return `${repository.owner}/${repository.name}`;
}

export function findRepositories(
  repositories: Repository[],
  ids: string[],
): Repository[] {
  return ids
    .map((id) => repositories.find((repository) => repository.id === id))
    .filter((repository): repository is Repository => repository !== undefined);
}

/** "Never used" or a relative age such as "3 days ago". */
export function formatLastUsed(token: ScopedToken, now: Date): string {
  if (token.lastUsedAt === null) {
    return "Never used";
  }

  const elapsedMs = now.getTime() - new Date(token.lastUsedAt).getTime();
  const elapsedHours = Math.floor(elapsedMs / 3_600_000);

  if (elapsedHours < 1) {
    return "Used less than an hour ago";
  }

  if (elapsedHours < 24) {
    return `Used ${elapsedHours} hour${elapsedHours === 1 ? "" : "s"} ago`;
  }

  const elapsedDays = Math.floor(elapsedHours / 24);

  return `Used ${elapsedDays} day${elapsedDays === 1 ? "" : "s"} ago`;
}

export function formatCreatedAt(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
