"use client";

import { AlertDialog, Button, Card, Chip, Separator } from "@heroui/react";

import { ProviderIcon } from "@/components/icons/provider-icons";
import { ConnectProviderDialog } from "@/components/tokens/connect-provider-dialog";
import { PROVIDERS } from "@/lib/providers";
import type { GitProviderId, ProviderConnection } from "@/lib/types";

interface ConnectedAccountsCardProps {
  connections: ProviderConnection[];
  onConnect: (provider: GitProviderId) => void;
  onDisconnect: (provider: GitProviderId) => void;
  /** Number of tokens scoped to each provider, used to warn before unlinking. */
  scopedTokenCount: Record<GitProviderId, number>;
}

const CONNECT_SCOPES: Record<GitProviderId, string[]> = {
  github: ["Read repository names and visibility", "No access to your code"],
  gitlab: ["Read project names and visibility", "No access to your code"],
};

/** Lists the Git providers linked to the workspace, and links new ones. */
export function ConnectedAccountsCard({
  connections,
  onConnect,
  onDisconnect,
  scopedTokenCount,
}: ConnectedAccountsCardProps) {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Connected accounts</Card.Title>
        <Card.Description>
          Link a provider to scope CI/CD tokens to individual repositories.
        </Card.Description>
      </Card.Header>
      <Card.Content className="flex flex-col">
        {PROVIDERS.map((provider, index) => {
          const connection = connections.find(
            (candidate) => candidate.provider === provider.id,
          );
          const isConnected = connection?.account != null;
          const tokenCount = scopedTokenCount[provider.id] ?? 0;

          return (
            <div key={provider.id}>
              {index > 0 ? <Separator className="my-3" /> : null}
              <div className="flex items-center gap-3">
                <ProviderIcon className="size-5 shrink-0" provider={provider.id} />
                <div className="flex min-w-0 flex-col">
                  <span className="text-sm font-medium">{provider.label}</span>
                  <span className="truncate text-xs text-muted">
                    {isConnected ? `Linked to ${connection?.account}` : "Not connected"}
                  </span>
                </div>
                {isConnected ? (
                  <Chip className="ms-2" color="success" size="sm" variant="soft">
                    Connected
                  </Chip>
                ) : null}
                <div className="ms-auto">
                  {isConnected ? (
                    <DisconnectButton
                      account={connection?.account ?? ""}
                      label={provider.label}
                      tokenCount={tokenCount}
                      onConfirm={() => onDisconnect(provider.id)}
                    />
                  ) : (
                    <ConnectProviderDialog
                      provider={provider.id}
                      scopes={CONNECT_SCOPES[provider.id]}
                      onAuthorize={() => onConnect(provider.id)}
                    >
                      <Button size="sm" variant="outline">
                        Connect
                      </Button>
                    </ConnectProviderDialog>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </Card.Content>
    </Card>
  );
}

interface DisconnectButtonProps {
  account: string;
  label: string;
  onConfirm: () => void;
  tokenCount: number;
}

/** Unlinking orphans every token scoped to that provider, so it asks first. */
function DisconnectButton({
  account,
  label,
  onConfirm,
  tokenCount,
}: DisconnectButtonProps) {
  return (
    <AlertDialog>
      <Button size="sm" variant="ghost">
        Disconnect
      </Button>
      <AlertDialog.Backdrop>
        <AlertDialog.Container>
          <AlertDialog.Dialog className="sm:max-w-[420px]">
            {({ close }) => (
              <>
                <AlertDialog.CloseTrigger />
                <AlertDialog.Header>
                  <AlertDialog.Icon status="warning" />
                  <AlertDialog.Heading>Disconnect {label}?</AlertDialog.Heading>
                </AlertDialog.Header>
                <AlertDialog.Body>
                  <p className="text-sm text-muted">
                    {tokenCount === 0
                      ? `No token is scoped to ${account} right now.`
                      : `${tokenCount} token${tokenCount === 1 ? "" : "s"} scoped to ${account} will stop working until you reconnect.`}
                  </p>
                </AlertDialog.Body>
                <AlertDialog.Footer>
                  <Button slot="close" variant="tertiary">
                    Cancel
                  </Button>
                  <Button
                    variant="danger"
                    onPress={() => {
                      onConfirm();
                      close();
                    }}
                  >
                    Disconnect
                  </Button>
                </AlertDialog.Footer>
              </>
            )}
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </AlertDialog>
  );
}
