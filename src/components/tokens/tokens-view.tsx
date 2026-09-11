"use client";

import { Key, Plus } from "@gravity-ui/icons";
import { Button, toast } from "@heroui/react";
import { EmptyState } from "@heroui-pro/react";
import { useState } from "react";

import { ConnectedAccountsCard } from "@/components/tokens/connected-accounts-card";
import { PersonalTokenCard } from "@/components/tokens/personal-token-card";
import { ScopedTokenCard } from "@/components/tokens/scoped-token-card";
import { TokenScopeDialog } from "@/components/tokens/token-scope-dialog";
import {
  DEMO_CONNECTIONS,
  DEMO_NOW,
  DEMO_REPOSITORIES,
  DEMO_TOKENS,
  PERSONAL_TOKEN_SECRET,
} from "@/data/demo-data";
import { findRepositories, generateSecret } from "@/lib/tokens";
import type { GitProviderId, ProviderConnection, ScopedToken } from "@/lib/types";

/**
 * Tokens screen of the HeroUI Pro dashboard.
 *
 * State lives in the browser because this is a proposal, not a product: every
 * handler below is where a server action or API call would go.
 */
export function TokensView() {
  const [personalSecret, setPersonalSecret] = useState(PERSONAL_TOKEN_SECRET);
  const [connections, setConnections] = useState<ProviderConnection[]>(DEMO_CONNECTIONS);
  const [tokens, setTokens] = useState<ScopedToken[]>(DEMO_TOKENS);

  const repositories = DEMO_REPOSITORIES;

  /** How many tokens would break if a provider were unlinked. */
  const scopedTokenCount = tokens.reduce(
    (counts, token) => {
      const providers = new Set(
        findRepositories(repositories, token.repositoryIds).map(
          (repository) => repository.provider,
        ),
      );

      for (const provider of providers) {
        counts[provider] += 1;
      }

      return counts;
    },
    { github: 0, gitlab: 0 } as Record<GitProviderId, number>,
  );

  const connectProvider = (provider: GitProviderId) => {
    setConnections((current) =>
      current.map((connection) =>
        connection.provider === provider
          ? {
              ...connection,
              account: provider === "github" ? "acme-studio" : "acme-platform",
              connectedAt: DEMO_NOW.toISOString(),
            }
          : connection,
      ),
    );
    toast("Provider connected", { variant: "success" });
  };

  const disconnectProvider = (provider: GitProviderId) => {
    setConnections((current) =>
      current.map((connection) =>
        connection.provider === provider
          ? { ...connection, account: null, connectedAt: null }
          : connection,
      ),
    );
    toast("Provider disconnected");
  };

  const createToken = ({
    name,
    repositoryIds,
  }: {
    name: string;
    repositoryIds: string[];
  }) => {
    const token: ScopedToken = {
      id: `token-${Date.now()}`,
      name,
      secret: generateSecret("ci"),
      createdAt: DEMO_NOW.toISOString(),
      lastUsedAt: null,
      repositoryIds,
    };

    setTokens((current) => [...current, token]);
    toast(`${name} created`, { variant: "success" });
  };

  const resetToken = (tokenId: string) => {
    setTokens((current) =>
      current.map((token) =>
        token.id === tokenId ? { ...token, secret: generateSecret("ci") } : token,
      ),
    );
    toast("A new secret has been issued", { variant: "success" });
  };

  const revokeToken = (tokenId: string) => {
    setTokens((current) => current.filter((token) => token.id !== tokenId));
    toast("Token revoked");
  };

  const editScope = (tokenId: string, repositoryIds: string[]) => {
    setTokens((current) =>
      current.map((token) =>
        token.id === tokenId ? { ...token, repositoryIds } : token,
      ),
    );
    toast("Scope updated", { variant: "success" });
  };

  return (
    <div className="mx-auto flex w-full max-w-[720px] flex-col gap-10 px-6 py-10">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">Tokens</h1>
        <p className="text-sm text-muted">
          Manage your HeroUI Pro tokens for local tools and CI/CD pipelines.
        </p>
      </header>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold">Personal Token</h2>
        <PersonalTokenCard
          secret={personalSecret}
          onReset={() => {
            setPersonalSecret(generateSecret("pat"));
            toast("A new personal token has been issued", { variant: "success" });
          }}
        />
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-sm font-semibold">CI/CD Tokens</h2>
          <TokenScopeDialog
            connections={connections}
            mode="create"
            repositories={repositories}
            onSubmit={createToken}
          >
            <Button size="sm" variant="outline">
              <Plus className="size-4" />
              New token
            </Button>
          </TokenScopeDialog>
        </div>

        <ConnectedAccountsCard
          connections={connections}
          scopedTokenCount={scopedTokenCount}
          onConnect={connectProvider}
          onDisconnect={disconnectProvider}
        />

        {tokens.length === 0 ? (
          <EmptyState className="rounded-2xl border border-dashed border-border">
            <EmptyState.Header>
              <EmptyState.Media variant="icon">
                <Key />
              </EmptyState.Media>
              <EmptyState.Title>No CI/CD token yet</EmptyState.Title>
              <EmptyState.Description>
                Create a token scoped to the repositories whose pipelines install HeroUI
                Pro.
              </EmptyState.Description>
            </EmptyState.Header>
            <EmptyState.Content>
              <TokenScopeDialog
                connections={connections}
                mode="create"
                repositories={repositories}
                onSubmit={createToken}
              >
                <Button size="sm">
                  <Plus className="size-4" />
                  New token
                </Button>
              </TokenScopeDialog>
            </EmptyState.Content>
          </EmptyState>
        ) : (
          tokens.map((token) => (
            <ScopedTokenCard
              key={token.id}
              connections={connections}
              now={DEMO_NOW}
              repositories={repositories}
              token={token}
              onEditScope={(repositoryIds) => editScope(token.id, repositoryIds)}
              onReset={() => resetToken(token.id)}
              onRevoke={() => revokeToken(token.id)}
            />
          ))
        )}

        <p className="text-xs text-muted">
          Each token authenticates only for the repositories listed on its card. Revoking
          one never affects the others.
        </p>
      </section>
    </div>
  );
}
