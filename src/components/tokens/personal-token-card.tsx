"use client";

import { ArrowsRotateLeft } from "@gravity-ui/icons";
import { Button, Card, Link } from "@heroui/react";

import { ResetTokenDialog } from "@/components/tokens/reset-token-dialog";
import { SecretField } from "@/components/tokens/secret-field";

interface PersonalTokenCardProps {
  onReset: () => void;
  secret: string;
}

/**
 * The personal token, unchanged from the current dashboard except for the
 * confirmation step added before rotating the secret.
 */
export function PersonalTokenCard({ onReset, secret }: PersonalTokenCardProps) {
  return (
    <Card>
      <Card.Header className="flex-row items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <Card.Title>Personal token</Card.Title>
          <Card.Description>
            Use this token for local MCP tools, agent skills, and installs.{" "}
            <Link
              href="https://heroui.pro/docs"
              rel="noopener noreferrer"
              target="_blank"
            >
              View docs
              <Link.Icon aria-hidden="true" />
            </Link>
          </Card.Description>
        </div>
        <ResetTokenDialog
          impact="Local MCP tools and agent skills need the new value to keep working."
          tokenName="your personal token"
          onConfirm={onReset}
        >
          <Button size="sm" variant="outline">
            <ArrowsRotateLeft className="size-4" />
            Reset token
          </Button>
        </ResetTokenDialog>
      </Card.Header>
      <Card.Content>
        <SecretField label="personal token" secret={secret} />
      </Card.Content>
      <Card.Footer>
        <p className="text-xs text-muted">
          This token is tied to your account and gives you personal usage attribution in
          local AI tools.
        </p>
      </Card.Footer>
    </Card>
  );
}
