import type { ProviderConnection, Repository, ScopedToken } from "@/lib/types";

/**
 * Static fixtures so the proposal runs without a backend. Everything here is
 * fictional; swap it for the real provider APIs when wiring the screen up.
 */

export const DEMO_ACCOUNT = {
  email: "alex@acme.dev",
  name: "Alex Rivera",
  workspace: "Acme Studio",
} as const;

export const PERSONAL_TOKEN_SECRET = "4236b1c8d94e7af20356ce881d47f9ed";

export const DEMO_REPOSITORIES: Repository[] = [
  {
    id: "gh-storefront",
    provider: "github",
    owner: "acme-studio",
    name: "storefront",
    isPrivate: true,
  },
  {
    id: "gh-design-system",
    provider: "github",
    owner: "acme-studio",
    name: "design-system",
    isPrivate: true,
  },
  {
    id: "gh-marketing-site",
    provider: "github",
    owner: "acme-studio",
    name: "marketing-site",
    isPrivate: false,
  },
  {
    id: "gh-admin-console",
    provider: "github",
    owner: "acme-studio",
    name: "admin-console",
    isPrivate: true,
  },
  {
    id: "gl-billing-api",
    provider: "gitlab",
    owner: "acme-platform",
    name: "billing-api",
    isPrivate: true,
  },
  {
    id: "gl-infra-pipelines",
    provider: "gitlab",
    owner: "acme-platform",
    name: "infra-pipelines",
    isPrivate: true,
  },
];

export const DEMO_CONNECTIONS: ProviderConnection[] = [
  {
    provider: "github",
    account: "acme-studio",
    connectedAt: "2026-07-02T09:12:00.000Z",
  },
  {
    provider: "gitlab",
    account: null,
    connectedAt: null,
  },
];

export const DEMO_TOKENS: ScopedToken[] = [
  {
    id: "token-storefront",
    name: "Storefront deploys",
    secret: "a681f0c3b7d248e59a1c40bf7e33e8d2",
    createdAt: "2026-07-14T10:04:00.000Z",
    lastUsedAt: "2026-09-10T18:22:00.000Z",
    repositoryIds: ["gh-storefront"],
  },
  {
    id: "token-shared-frontend",
    name: "Frontend CI",
    secret: "c7d2e91a4b6f38c05d7e21ab90fc4471",
    createdAt: "2026-08-03T15:40:00.000Z",
    lastUsedAt: "2026-09-08T07:05:00.000Z",
    repositoryIds: ["gh-design-system", "gh-marketing-site"],
  },
];

/**
 * Reference date for the "last used" labels.
 *
 * Fixed on purpose: the fixtures must render identically on the server and in
 * the browser, and a demo should not drift as time passes.
 */
export const DEMO_NOW = new Date("2026-09-11T12:00:00.000Z");
