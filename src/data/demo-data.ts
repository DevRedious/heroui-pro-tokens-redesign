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
  {
    id: "gh-web-checkout",
    provider: "github",
    owner: "acme-studio",
    name: "web-checkout",
    isPrivate: true,
  },
  {
    id: "gh-web-account",
    provider: "github",
    owner: "acme-studio",
    name: "web-account",
    isPrivate: true,
  },
  {
    id: "gh-web-search",
    provider: "github",
    owner: "acme-studio",
    name: "web-search",
    isPrivate: false,
  },
  {
    id: "gh-mobile-app",
    provider: "github",
    owner: "acme-studio",
    name: "mobile-app",
    isPrivate: true,
  },
  {
    id: "gh-docs-site",
    provider: "github",
    owner: "acme-studio",
    name: "docs-site",
    isPrivate: false,
  },
  {
    id: "gh-email-templates",
    provider: "github",
    owner: "acme-studio",
    name: "email-templates",
    isPrivate: true,
  },
  {
    id: "gh-feature-flags",
    provider: "github",
    owner: "acme-studio",
    name: "feature-flags",
    isPrivate: true,
  },
  {
    id: "gh-analytics-events",
    provider: "github",
    owner: "acme-studio",
    name: "analytics-events",
    isPrivate: true,
  },
  {
    id: "gl-orders-api",
    provider: "gitlab",
    owner: "acme-platform",
    name: "orders-api",
    isPrivate: true,
  },
  {
    id: "gl-inventory-api",
    provider: "gitlab",
    owner: "acme-platform",
    name: "inventory-api",
    isPrivate: true,
  },
  {
    id: "gl-payments-worker",
    provider: "gitlab",
    owner: "acme-platform",
    name: "payments-worker",
    isPrivate: true,
  },
  {
    id: "gl-search-indexer",
    provider: "gitlab",
    owner: "acme-platform",
    name: "search-indexer",
    isPrivate: true,
  },
  {
    id: "gl-notification-worker",
    provider: "gitlab",
    owner: "acme-platform",
    name: "notification-worker",
    isPrivate: true,
  },
  {
    id: "gl-data-warehouse",
    provider: "gitlab",
    owner: "acme-platform",
    name: "data-warehouse",
    isPrivate: true,
  },
  {
    id: "gl-terraform-modules",
    provider: "gitlab",
    owner: "acme-platform",
    name: "terraform-modules",
    isPrivate: true,
  },
  {
    id: "gl-observability-stack",
    provider: "gitlab",
    owner: "acme-platform",
    name: "observability-stack",
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
  {
    id: "token-platform",
    name: "Platform nightly builds",
    secret: "f30ab72c5d914e68b0a37cd1e94f2b55",
    createdAt: "2026-06-21T08:30:00.000Z",
    lastUsedAt: "2026-09-11T05:15:00.000Z",
    repositoryIds: [
      "gl-billing-api",
      "gl-infra-pipelines",
      "gl-orders-api",
      "gl-inventory-api",
      "gl-payments-worker",
      "gl-search-indexer",
      "gl-notification-worker",
      "gl-data-warehouse",
      "gl-terraform-modules",
      "gl-observability-stack",
      "gh-admin-console",
      "gh-web-checkout",
      "gh-web-account",
      "gh-web-search",
      "gh-mobile-app",
      "gh-email-templates",
      "gh-feature-flags",
      "gh-analytics-events",
      "gh-docs-site",
    ],
  },
];

/**
 * Reference date for the "last used" labels.
 *
 * Fixed on purpose: the fixtures must render identically on the server and in
 * the browser, and a demo should not drift as time passes.
 */
export const DEMO_NOW = new Date("2026-09-11T12:00:00.000Z");
