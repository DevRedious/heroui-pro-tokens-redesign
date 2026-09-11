"use client";

import { AlertDialog, Button, Description, Input, Label, TextField } from "@heroui/react";
import type { ReactNode } from "react";
import { useState } from "react";

interface RevokeTokenDialogProps {
  /** Trigger element rendered by the caller. */
  children: ReactNode;
  onConfirm: () => void;
  /** Repositories that lose access, listed so the blast radius is explicit. */
  scopeSummary: string;
  tokenName: string;
}

/**
 * Two-step confirmation for deleting a token for good.
 *
 * Revoking cannot be undone and cannot be rolled back by resetting, so the
 * second step asks for the token name, typed by hand.
 */
export function RevokeTokenDialog({
  children,
  onConfirm,
  scopeSummary,
  tokenName,
}: RevokeTokenDialogProps) {
  const [typedName, setTypedName] = useState("");
  const isNameConfirmed = typedName.trim() === tokenName;

  return (
    <AlertDialog>
      {children}
      <AlertDialog.Backdrop
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setTypedName("");
          }
        }}
      >
        <AlertDialog.Container>
          <AlertDialog.Dialog className="sm:max-w-[440px]">
            {({ close }) => (
              <>
                <AlertDialog.CloseTrigger />
                <AlertDialog.Header>
                  <AlertDialog.Icon status="danger" />
                  <AlertDialog.Heading>Revoke {tokenName}?</AlertDialog.Heading>
                </AlertDialog.Header>
                <AlertDialog.Body className="flex flex-col gap-4">
                  <p className="text-sm text-muted">
                    Every pipeline using this token starts failing right away. It cannot
                    be restored, only replaced by a new token.
                  </p>
                  <p className="text-sm text-muted">
                    Loses access: <span className="text-foreground">{scopeSummary}</span>
                  </p>
                  <TextField value={typedName} onChange={setTypedName} autoComplete="off">
                    <Label>
                      Type <span className="font-mono">{tokenName}</span> to confirm
                    </Label>
                    <Input placeholder={tokenName} variant="secondary" />
                    <Description>This step prevents accidental revocations.</Description>
                  </TextField>
                </AlertDialog.Body>
                <AlertDialog.Footer>
                  <Button slot="close" variant="tertiary">
                    Cancel
                  </Button>
                  <Button
                    isDisabled={!isNameConfirmed}
                    variant="danger"
                    onPress={() => {
                      onConfirm();
                      close();
                    }}
                  >
                    Revoke token
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
