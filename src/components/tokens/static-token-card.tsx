"use client";

import { ArrowsRotateLeft } from "@gravity-ui/icons";
import { Button, Card, Link } from "@heroui/react";
import type { ReactNode } from "react";

import { ResetTokenDialog } from "@/components/tokens/reset-token-dialog";
import { SecretField } from "@/components/tokens/secret-field";

interface StaticTokenCardProps {
  description: ReactNode;
  footnote: ReactNode;
  /** Sentence naming what stops working once the secret rotates. */
  resetImpact: string;
  onReset: () => void;
  secret: string;
  title: string;
  /** How the token is named inside the confirmation dialog. */
  tokenName: string;
}

/**
 * Account-level token card: a title, a secret, and a reset action.
 *
 * Used as-is by the personal token, and by the single CI/CD token of the
 * current dashboard on the /before route.
 */
export function StaticTokenCard({
  description,
  footnote,
  onReset,
  resetImpact,
  secret,
  title,
  tokenName,
}: StaticTokenCardProps) {
  return (
    <Card>
      <Card.Header className="flex-row items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <Card.Title>{title}</Card.Title>
          <Card.Description>
            {description}{" "}
            <Link
              href="https://heroui.pro/docs"
              rel="noopener noreferrer"
              target="_blank"
            >
              View docs
              <Link.Icon aria-hidden="true" />
            </Link>
            .
          </Card.Description>
        </div>
        <ResetTokenDialog impact={resetImpact} tokenName={tokenName} onConfirm={onReset}>
          <Button size="sm" variant="outline">
            <ArrowsRotateLeft className="size-4" />
            Reset token
          </Button>
        </ResetTokenDialog>
      </Card.Header>
      <Card.Content>
        <SecretField label={title} secret={secret} />
      </Card.Content>
      <Card.Footer>
        <p className="text-xs text-muted">{footnote}</p>
      </Card.Footer>
    </Card>
  );
}
