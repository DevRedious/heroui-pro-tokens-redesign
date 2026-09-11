"use client";

import { Magnifier } from "@gravity-ui/icons";
import { Checkbox, CheckboxGroup, Chip, InputGroup, TextField } from "@heroui/react";
import { useMemo, useState } from "react";

import { ProviderIcon } from "@/components/icons/provider-icons";
import { providerLabel } from "@/lib/providers";
import { repositorySlug } from "@/lib/tokens";
import type { ProviderConnection, Repository } from "@/lib/types";

interface RepositoryPickerProps {
  connections: ProviderConnection[];
  onChange: (repositoryIds: string[]) => void;
  repositories: Repository[];
  /** Currently scoped repository ids. */
  value: string[];
}

/**
 * Searchable repository list used when creating or editing a token scope.
 *
 * Only repositories from connected providers are listed: a token cannot be
 * scoped to something HeroUI Pro has no way to verify.
 */
export function RepositoryPicker({
  connections,
  onChange,
  repositories,
  value,
}: RepositoryPickerProps) {
  const [query, setQuery] = useState("");

  const visibleRepositories = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const connectedProviders = connections
      .filter((connection) => connection.account !== null)
      .map((connection) => connection.provider);

    return repositories
      .filter((repository) => connectedProviders.includes(repository.provider))
      .filter((repository) =>
        normalizedQuery.length === 0
          ? true
          : repositorySlug(repository).toLowerCase().includes(normalizedQuery),
      );
  }, [connections, query, repositories]);

  const disconnectedProviders = connections.filter(
    (connection) => connection.account === null,
  );

  return (
    <div className="flex flex-col gap-3">
      <TextField aria-label="Search repositories" value={query} onChange={setQuery}>
        <InputGroup variant="secondary">
          <InputGroup.Prefix>
            <Magnifier className="size-4 text-muted" />
          </InputGroup.Prefix>
          <InputGroup.Input placeholder="Search repositories" />
        </InputGroup>
      </TextField>

      <CheckboxGroup
        aria-label="Repositories in scope"
        className="max-h-[280px] gap-1 overflow-y-auto"
        value={value}
        onChange={onChange}
      >
        {visibleRepositories.map((repository) => (
          <Checkbox
            key={repository.id}
            className="w-full"
            value={repository.id}
            variant="secondary"
          >
            <Checkbox.Content className="flex w-full items-center gap-3 rounded-xl px-3 py-2 transition-colors data-[selected=true]:bg-accent/10">
              <Checkbox.Control>
                <Checkbox.Indicator />
              </Checkbox.Control>
              <ProviderIcon className="size-4 shrink-0" provider={repository.provider} />
              <span className="truncate text-sm">{repositorySlug(repository)}</span>
              <Chip className="ms-auto" size="sm" variant="soft">
                {repository.isPrivate ? "Private" : "Public"}
              </Chip>
            </Checkbox.Content>
          </Checkbox>
        ))}

        {visibleRepositories.length === 0 ? (
          <p className="px-1 py-6 text-center text-sm text-muted">
            No repository matches this search.
          </p>
        ) : null}
      </CheckboxGroup>

      {disconnectedProviders.map((connection) => (
        <p key={connection.provider} className="text-xs text-muted">
          Connect {providerLabel(connection.provider)} to scope a token to its
          repositories.
        </p>
      ))}
    </div>
  );
}
