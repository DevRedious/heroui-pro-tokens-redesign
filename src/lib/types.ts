/** Git hosting providers a CI/CD token can be scoped to. */
export type GitProviderId = "github" | "gitlab";

/** A repository exposed by a connected provider account. */
export interface Repository {
  id: string;
  provider: GitProviderId;
  /** Organization or user that owns the repository. */
  owner: string;
  name: string;
  isPrivate: boolean;
}

/** State of the OAuth link between a HeroUI Pro account and a provider. */
export interface ProviderConnection {
  provider: GitProviderId;
  /** Handle of the linked account, `null` while the provider is disconnected. */
  account: string | null;
  connectedAt: string | null;
}

/**
 * A CI/CD token restricted to an explicit list of repositories.
 *
 * `repositoryIds` is the whole proposal: today a workspace holds a single
 * CI/CD token shared by every pipeline, so revoking it anywhere breaks it
 * everywhere.
 */
export interface ScopedToken {
  id: string;
  name: string;
  /** Full secret. Only the masked form is rendered until the user reveals it. */
  secret: string;
  createdAt: string;
  lastUsedAt: string | null;
  repositoryIds: string[];
}
