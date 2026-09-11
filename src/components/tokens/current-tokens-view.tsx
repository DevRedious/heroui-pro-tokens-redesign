"use client";

import { toast } from "@heroui/react";
import { useState } from "react";

import { PersonalTokenCard } from "@/components/tokens/personal-token-card";
import { StaticTokenCard } from "@/components/tokens/static-token-card";
import { DEMO_TOKENS, PERSONAL_TOKEN_SECRET } from "@/data/demo-data";
import { generateSecret } from "@/lib/tokens";

/**
 * The Tokens screen as it exists today, rebuilt with the same components.
 *
 * Kept in the repository as the baseline of the proposal: one account, one
 * CI/CD token, shared by every pipeline.
 */
export function CurrentTokensView() {
  const [personalSecret, setPersonalSecret] = useState(PERSONAL_TOKEN_SECRET);
  const [ciSecret, setCiSecret] = useState(DEMO_TOKENS[0].secret);

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
        <h2 className="text-sm font-semibold">CI/CD Token</h2>
        <StaticTokenCard
          description="Use this token for CI/CD pipelines and shared automation only."
          footnote="This token is private and must only be used in trusted environments."
          resetImpact="Every pipeline sharing this token needs the new value."
          secret={ciSecret}
          title="CI/CD token"
          tokenName="your CI/CD token"
          onReset={() => {
            setCiSecret(generateSecret("ci"));
            toast("A new CI/CD token has been issued", { variant: "success" });
          }}
        />
      </section>
    </div>
  );
}
