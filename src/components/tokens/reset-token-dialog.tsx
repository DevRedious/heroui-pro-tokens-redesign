"use client";

import { AlertDialog, Button, Checkbox } from "@heroui/react";
import type { ReactNode } from "react";
import { useState } from "react";

interface ResetTokenDialogProps {
  /** Trigger element rendered by the caller, usually a "Reset token" button. */
  children: ReactNode;
  /** One sentence naming what stops working once the secret rotates. */
  impact: string;
  onConfirm: () => void;
  tokenName: string;
}

/**
 * Two-step confirmation for rotating a secret.
 *
 * Opening the dialog is the first step; ticking the acknowledgement is the
 * second, and the confirm button stays disabled until then. Rotation is not
 * reversible, so a single click should never be enough.
 */
export function ResetTokenDialog({
  children,
  impact,
  onConfirm,
  tokenName,
}: ResetTokenDialogProps) {
  const [isAcknowledged, setIsAcknowledged] = useState(false);

  return (
    <AlertDialog>
      {children}
      <AlertDialog.Backdrop
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setIsAcknowledged(false);
          }
        }}
      >
        <AlertDialog.Container>
          <AlertDialog.Dialog className="sm:max-w-[440px]">
            {({ close }) => (
              <>
                <AlertDialog.CloseTrigger />
                <AlertDialog.Header>
                  <AlertDialog.Icon status="warning" />
                  <AlertDialog.Heading>Reset {tokenName}?</AlertDialog.Heading>
                </AlertDialog.Header>
                <AlertDialog.Body className="flex flex-col gap-4">
                  <p className="text-sm text-muted">
                    A new secret is issued immediately and the current one stops working.{" "}
                    {impact}
                  </p>
                  {/* The dark theme keeps field and overlay tones close, so the
                      row is tinted to keep the unchecked control readable. */}
                  <div className="rounded-2xl bg-surface-secondary px-4 py-3">
                    <Checkbox isSelected={isAcknowledged} onChange={setIsAcknowledged}>
                      <Checkbox.Content>
                        <Checkbox.Control>
                          <Checkbox.Indicator />
                        </Checkbox.Control>
                        I understand the current secret will stop working
                      </Checkbox.Content>
                    </Checkbox>
                  </div>
                </AlertDialog.Body>
                <AlertDialog.Footer>
                  <Button slot="close" variant="tertiary">
                    Cancel
                  </Button>
                  <Button
                    isDisabled={!isAcknowledged}
                    variant="danger"
                    onPress={() => {
                      onConfirm();
                      close();
                    }}
                  >
                    Reset token
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
