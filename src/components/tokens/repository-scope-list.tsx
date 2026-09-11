"use client";

import { Button, Chip, Modal } from "@heroui/react";

import { ProviderIcon } from "@/components/icons/provider-icons";
import { PROVIDERS } from "@/lib/providers";
import { repositorySlug } from "@/lib/tokens";
import type { Repository } from "@/lib/types";

/** Chips shown on the card; the rest lives behind the counter. */
const VISIBLE_COUNT = 4;

interface RepositoryScopeListProps {
  repositories: Repository[];
  /** Named in the modal heading so the list is never ambiguous. */
  tokenName: string;
}

/**
 * The repositories a token covers.
 *
 * A platform-wide token can cover twenty repositories, which would turn the
 * card into a wall of chips. Past four, the remainder collapses into a counter
 * that opens the full list in a modal, so the card keeps a fixed height.
 */
export function RepositoryScopeList({
  repositories,
  tokenName,
}: RepositoryScopeListProps) {
  const visibleRepositories = repositories.slice(0, VISIBLE_COUNT);
  const hiddenCount = repositories.length - visibleRepositories.length;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {visibleRepositories.map((repository) => (
        <RepositoryChip key={repository.id} repository={repository} />
      ))}

      {hiddenCount > 0 ? (
        <Modal>
          <Button
            aria-label={`Show the ${repositories.length} repositories scoped to ${tokenName}`}
            className="h-6 px-2 text-xs"
            size="sm"
            variant="ghost"
          >
            +{hiddenCount}
          </Button>
          <Modal.Backdrop>
            <Modal.Container>
              <Modal.Dialog className="sm:max-w-[480px]">
                <Modal.CloseTrigger />
                <Modal.Header>
                  <Modal.Heading>{tokenName}</Modal.Heading>
                </Modal.Header>
                <Modal.Body className="flex max-h-[420px] flex-col gap-5 overflow-y-auto">
                  <p className="text-sm text-muted">
                    This token authenticates for {repositories.length} repositories.
                  </p>
                  <RepositoryGroups repositories={repositories} />
                </Modal.Body>
                <Modal.Footer>
                  <Button slot="close" variant="tertiary">
                    Close
                  </Button>
                </Modal.Footer>
              </Modal.Dialog>
            </Modal.Container>
          </Modal.Backdrop>
        </Modal>
      ) : null}
    </div>
  );
}

function RepositoryChip({ repository }: { repository: Repository }) {
  return (
    <Chip size="sm" variant="secondary">
      <ProviderIcon className="size-3.5" provider={repository.provider} />
      <Chip.Label>{repositorySlug(repository)}</Chip.Label>
    </Chip>
  );
}

/** Full list, grouped by provider so a long scope stays readable. */
function RepositoryGroups({ repositories }: { repositories: Repository[] }) {
  return (
    <>
      {PROVIDERS.map((provider) => {
        const owned = repositories.filter(
          (repository) => repository.provider === provider.id,
        );

        if (owned.length === 0) {
          return null;
        }

        return (
          <section key={provider.id} className="flex flex-col gap-2">
            <h3 className="flex items-center gap-2 text-xs font-semibold text-muted">
              <ProviderIcon className="size-3.5" provider={provider.id} />
              {provider.label}
              <span className="font-normal">({owned.length})</span>
            </h3>
            <ul className="flex flex-col">
              {owned.map((repository) => (
                <li
                  key={repository.id}
                  className="flex items-center justify-between gap-3 border-b border-separator py-2 text-sm last:border-b-0"
                >
                  <span className="truncate">{repositorySlug(repository)}</span>
                  <Chip size="sm" variant="soft">
                    {repository.isPrivate ? "Private" : "Public"}
                  </Chip>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </>
  );
}
