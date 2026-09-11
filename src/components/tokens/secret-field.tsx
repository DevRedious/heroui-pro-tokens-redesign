"use client";

import { Copy, Eye, EyeSlash } from "@gravity-ui/icons";
import { Button, InputGroup, TextField, toast } from "@heroui/react";
import { useState } from "react";

import { maskSecret } from "@/lib/tokens";

interface SecretFieldProps {
  /** Accessible name, since the field has no visible label. */
  label: string;
  secret: string;
}

/**
 * Read-only secret input with reveal and copy affordances.
 *
 * The masked value is a display string, never the real secret, so the token
 * stays out of the DOM until the user asks for it.
 */
export function SecretField({ label, secret }: SecretFieldProps) {
  const [isRevealed, setIsRevealed] = useState(false);

  const copySecret = async () => {
    try {
      await navigator.clipboard.writeText(secret);
      toast("Token copied to clipboard", { variant: "success" });
    } catch {
      toast("Could not access the clipboard", { variant: "danger" });
    }
  };

  return (
    <TextField
      aria-label={label}
      isReadOnly
      value={isRevealed ? secret : maskSecret(secret)}
    >
      <InputGroup variant="secondary">
        <InputGroup.Input className="font-mono text-sm" />
        <InputGroup.Suffix className="gap-0 pe-0">
          <Button
            isIconOnly
            aria-label={isRevealed ? `Hide ${label}` : `Reveal ${label}`}
            size="sm"
            variant="ghost"
            onPress={() => setIsRevealed((revealed) => !revealed)}
          >
            {isRevealed ? <EyeSlash className="size-4" /> : <Eye className="size-4" />}
          </Button>
          <Button
            isIconOnly
            aria-label={`Copy ${label}`}
            size="sm"
            variant="ghost"
            onPress={copySecret}
          >
            <Copy className="size-4" />
          </Button>
        </InputGroup.Suffix>
      </InputGroup>
    </TextField>
  );
}
