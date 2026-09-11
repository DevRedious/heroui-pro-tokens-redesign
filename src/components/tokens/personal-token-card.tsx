"use client";

import { StaticTokenCard } from "@/components/tokens/static-token-card";

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
    <StaticTokenCard
      description="Use this token for local MCP tools, agent skills, and installs."
      footnote="This token is tied to your account and gives you personal usage attribution in local AI tools."
      resetImpact="Local MCP tools and agent skills need the new value to keep working."
      secret={secret}
      title="Personal token"
      tokenName="your personal token"
      onReset={onReset}
    />
  );
}
