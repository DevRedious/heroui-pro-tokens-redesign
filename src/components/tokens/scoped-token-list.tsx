"use client";

import { Key, Magnifier, Plus } from "@gravity-ui/icons";
import { Button, InputGroup, Pagination, TextField } from "@heroui/react";
import { EmptyState } from "@heroui-pro/react";
import { useMemo, useState } from "react";

import { ScopedTokenCard } from "@/components/tokens/scoped-token-card";
import { TokenScopeDialog } from "@/components/tokens/token-scope-dialog";
import { findRepositories, repositorySlug } from "@/lib/tokens";
import type { ProviderConnection, Repository, ScopedToken } from "@/lib/types";

/** Cards per page. Beyond this, the list paginates instead of growing. */
const PAGE_SIZE = 5;
/** Below this, searching and paging would only add noise. */
const TOOLBAR_THRESHOLD = 6;

interface ScopedTokenListProps {
  connections: ProviderConnection[];
  now: Date;
  onCreate: (values: { name: string; repositoryIds: string[] }) => void;
  onEditScope: (tokenId: string, repositoryIds: string[]) => void;
  onReset: (tokenId: string) => void;
  onRevoke: (tokenId: string) => void;
  repositories: Repository[];
  tokens: ScopedToken[];
}

/**
 * The CI/CD token list.
 *
 * One token per repository means a large workspace holds dozens of them, so the
 * list searches by token name *and* by repository, and pages at five cards.
 * Answering "which token still reaches storefront?" has to take one search, not
 * a scroll.
 */
export function ScopedTokenList({
  connections,
  now,
  onCreate,
  onEditScope,
  onReset,
  onRevoke,
  repositories,
  tokens,
}: ScopedTokenListProps) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const matchingTokens = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (normalizedQuery.length === 0) {
      return tokens;
    }

    return tokens.filter((token) => {
      const haystack = [
        token.name,
        ...findRepositories(repositories, token.repositoryIds).map(repositorySlug),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [query, repositories, tokens]);

  const pageCount = Math.max(1, Math.ceil(matchingTokens.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pageTokens = matchingTokens.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );
  const hasToolbar = tokens.length >= TOOLBAR_THRESHOLD;

  const search = (value: string) => {
    setQuery(value);
    setPage(1);
  };

  if (tokens.length === 0) {
    return (
      <EmptyState className="rounded-2xl border border-border border-dashed">
        <EmptyState.Header>
          <EmptyState.Media variant="icon">
            <Key />
          </EmptyState.Media>
          <EmptyState.Title>No CI/CD token yet</EmptyState.Title>
          <EmptyState.Description>
            Create a token scoped to the repositories whose pipelines install HeroUI Pro.
          </EmptyState.Description>
        </EmptyState.Header>
        <EmptyState.Content>
          <TokenScopeDialog
            connections={connections}
            mode="create"
            repositories={repositories}
            onSubmit={onCreate}
          >
            <Button size="sm">
              <Plus className="size-4" />
              New token
            </Button>
          </TokenScopeDialog>
        </EmptyState.Content>
      </EmptyState>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {hasToolbar ? (
        <TextField
          aria-label="Search tokens"
          className="w-full"
          value={query}
          onChange={search}
        >
          <InputGroup variant="secondary">
            <InputGroup.Prefix>
              <Magnifier className="size-4 text-muted" />
            </InputGroup.Prefix>
            <InputGroup.Input placeholder="Search by token name or repository" />
          </InputGroup>
        </TextField>
      ) : null}

      {pageTokens.map((token) => (
        <ScopedTokenCard
          key={token.id}
          connections={connections}
          now={now}
          repositories={repositories}
          token={token}
          onEditScope={(repositoryIds) => onEditScope(token.id, repositoryIds)}
          onReset={() => onReset(token.id)}
          onRevoke={() => onRevoke(token.id)}
        />
      ))}

      {matchingTokens.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-border border-dashed px-6 py-10">
          <p className="text-sm text-muted">No token matches “{query.trim()}”.</p>
          <Button size="sm" variant="ghost" onPress={() => search("")}>
            Clear search
          </Button>
        </div>
      ) : null}

      {pageCount > 1 ? (
        <TokenPagination
          page={currentPage}
          pageCount={pageCount}
          total={matchingTokens.length}
          onPageChange={setPage}
        />
      ) : null}
    </div>
  );
}

interface TokenPaginationProps {
  onPageChange: (page: number) => void;
  page: number;
  pageCount: number;
  total: number;
}

function TokenPagination({ onPageChange, page, pageCount, total }: TokenPaginationProps) {
  const firstItem = (page - 1) * PAGE_SIZE + 1;
  const lastItem = Math.min(page * PAGE_SIZE, total);

  return (
    <Pagination className="w-full pt-1" size="sm">
      <Pagination.Summary>
        {firstItem}–{lastItem} of {total} tokens
      </Pagination.Summary>
      <Pagination.Content>
        <Pagination.Item>
          <Pagination.Previous
            isDisabled={page === 1}
            onPress={() => onPageChange(page - 1)}
          >
            <Pagination.PreviousIcon />
            <span>Previous</span>
          </Pagination.Previous>
        </Pagination.Item>
        {buildPageList(page, pageCount).map((entry, index) =>
          entry === "ellipsis" ? (
            // biome-ignore lint/suspicious/noArrayIndexKey: ellipsis slots have no id
            <Pagination.Item key={`ellipsis-${index}`}>
              <Pagination.Ellipsis />
            </Pagination.Item>
          ) : (
            <Pagination.Item key={entry}>
              <Pagination.Link
                isActive={entry === page}
                onPress={() => onPageChange(entry)}
              >
                {entry}
              </Pagination.Link>
            </Pagination.Item>
          ),
        )}
        <Pagination.Item>
          <Pagination.Next
            isDisabled={page === pageCount}
            onPress={() => onPageChange(page + 1)}
          >
            <span>Next</span>
            <Pagination.NextIcon />
          </Pagination.Next>
        </Pagination.Item>
      </Pagination.Content>
    </Pagination>
  );
}

/** First page, last page, and a window around the current one. */
function buildPageList(page: number, pageCount: number): (number | "ellipsis")[] {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  const pages: (number | "ellipsis")[] = [1];

  if (page > 3) {
    pages.push("ellipsis");
  }

  for (
    let value = Math.max(2, page - 1);
    value <= Math.min(pageCount - 1, page + 1);
    value++
  ) {
    pages.push(value);
  }

  if (page < pageCount - 2) {
    pages.push("ellipsis");
  }

  pages.push(pageCount);

  return pages;
}
