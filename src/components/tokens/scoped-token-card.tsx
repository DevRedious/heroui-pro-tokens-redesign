"use client";

import { ArrowsRotateLeft, Pencil, TrashBin } from "@gravity-ui/icons";
import { Button, Card } from "@heroui/react";

import { RepositoryScopeList } from "@/components/tokens/repository-scope-list";
import { ResetTokenDialog } from "@/components/tokens/reset-token-dialog";
import { RevokeTokenDialog } from "@/components/tokens/revoke-token-dialog";
import { SecretField } from "@/components/tokens/secret-field";
import { TokenScopeDialog } from "@/components/tokens/token-scope-dialog";
import {
  findRepositories,
  formatCreatedAt,
  formatLastUsed,
  summarizeScope,
} from "@/lib/tokens";
import type { ProviderConnection, Repository, ScopedToken } from "@/lib/types";

interface ScopedTokenCardProps {
  connections: ProviderConnection[];
  now: Date;
  onEditScope: (repositoryIds: string[]) => void;
  onReset: () => void;
  onRevoke: () => void;
  repositories: Repository[];
  token: ScopedToken;
}

/** One CI/CD token, with the repositories it is allowed to authenticate for. */
export function ScopedTokenCard({
  connections,
  now,
  onEditScope,
  onReset,
  onRevoke,
  repositories,
  token,
}: ScopedTokenCardProps) {
  const scopedRepositories = findRepositories(repositories, token.repositoryIds);
  const scopeSummary = summarizeScope(scopedRepositories);

  return (
    <Card>
      <Card.Header className="flex-row items-start justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-2">
          <Card.Title>{token.name}</Card.Title>
          <RepositoryScopeList repositories={scopedRepositories} tokenName={token.name} />
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <TokenScopeDialog
            connections={connections}
            initialName={token.name}
            initialRepositoryIds={token.repositoryIds}
            mode="edit"
            repositories={repositories}
            onSubmit={({ repositoryIds }) => onEditScope(repositoryIds)}
          >
            <Button
              isIconOnly
              aria-label={`Edit the scope of ${token.name}`}
              size="sm"
              variant="ghost"
            >
              <Pencil className="size-4" />
            </Button>
          </TokenScopeDialog>
          <ResetTokenDialog
            impact={`Pipelines running on ${scopeSummary} need the new value.`}
            tokenName={token.name}
            onConfirm={onReset}
          >
            <Button size="sm" variant="outline">
              <ArrowsRotateLeft className="size-4" />
              Reset token
            </Button>
          </ResetTokenDialog>
          <RevokeTokenDialog
            scopeSummary={scopeSummary}
            tokenName={token.name}
            onConfirm={onRevoke}
          >
            <Button
              isIconOnly
              aria-label={`Revoke ${token.name}`}
              size="sm"
              variant="danger-soft"
            >
              <TrashBin className="size-4" />
            </Button>
          </RevokeTokenDialog>
        </div>
      </Card.Header>
      <Card.Content>
        <SecretField label={token.name} secret={token.secret} />
      </Card.Content>
      <Card.Footer>
        <p className="text-xs text-muted">
          {scopedRepositories.length} repositor
          {scopedRepositories.length === 1 ? "y" : "ies"} ·{" "}
          {formatCreatedAt(token.createdAt)} · {formatLastUsed(token, now)}
        </p>
      </Card.Footer>
    </Card>
  );
}
