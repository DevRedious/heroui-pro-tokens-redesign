"use client";

import { CircleCheck } from "@gravity-ui/icons";
import { Button, Modal } from "@heroui/react";
import type { ReactNode } from "react";
import { useState } from "react";

import { ProviderIcon } from "@/components/icons/provider-icons";
import { providerLabel } from "@/lib/providers";
import type { GitProviderId } from "@/lib/types";

interface ConnectProviderDialogProps {
  /** Trigger element rendered by the caller. */
  children: ReactNode;
  onAuthorize: () => void;
  provider: GitProviderId;
  /** Permissions the OAuth app would request. */
  scopes: string[];
}

const AUTHORIZATION_DELAY_MS = 900;

/**
 * Stand-in for the provider OAuth screen.
 *
 * The real flow redirects to GitHub or GitLab; this dialog keeps the proposal
 * self-contained while showing the consent step and the pending state a
 * redirect would produce.
 */
export function ConnectProviderDialog({
  children,
  onAuthorize,
  provider,
  scopes,
}: ConnectProviderDialogProps) {
  const [isPending, setIsPending] = useState(false);
  const label = providerLabel(provider);

  const authorize = (close: () => void) => {
    setIsPending(true);

    window.setTimeout(() => {
      setIsPending(false);
      onAuthorize();
      close();
    }, AUTHORIZATION_DELAY_MS);
  };

  return (
    <Modal>
      {children}
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog className="sm:max-w-[420px]">
            {({ close }) => (
              <>
                <Modal.CloseTrigger />
                <Modal.Header>
                  <Modal.Icon className="bg-default text-foreground">
                    <ProviderIcon className="size-5" provider={provider} />
                  </Modal.Icon>
                  <Modal.Heading>Connect {label}</Modal.Heading>
                </Modal.Header>
                <Modal.Body className="flex flex-col gap-4">
                  <p className="text-sm text-muted">
                    HeroUI Pro will read the repository list of your {label} account so
                    tokens can be scoped to specific repositories.
                  </p>
                  <ul className="flex flex-col gap-2">
                    {scopes.map((scope) => (
                      <li key={scope} className="flex items-center gap-2 text-sm">
                        <CircleCheck className="size-4 shrink-0 text-success" />
                        {scope}
                      </li>
                    ))}
                  </ul>
                </Modal.Body>
                <Modal.Footer>
                  <Button slot="close" variant="tertiary">
                    Cancel
                  </Button>
                  <Button isPending={isPending} onPress={() => authorize(close)}>
                    Authorize {label}
                  </Button>
                </Modal.Footer>
              </>
            )}
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
