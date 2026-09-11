import type { GitProviderId } from "@/lib/types";

interface ProviderMeta {
  id: GitProviderId;
  label: string;
  /** Wording used in the simulated OAuth dialog. */
  scopeHint: string;
}

export const PROVIDERS: ProviderMeta[] = [
  {
    id: "github",
    label: "GitHub",
    scopeHint: "Read-only access to repository metadata.",
  },
  {
    id: "gitlab",
    label: "GitLab",
    scopeHint: "Read-only access to project metadata.",
  },
];

export function providerLabel(provider: GitProviderId): string {
  return provider === "github" ? "GitHub" : "GitLab";
}
