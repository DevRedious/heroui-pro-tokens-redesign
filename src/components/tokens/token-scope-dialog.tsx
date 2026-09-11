"use client";

import { Button, Description, Input, Label, Modal, TextField } from "@heroui/react";
import type { ReactNode } from "react";
import { useState } from "react";

import { RepositoryPicker } from "@/components/tokens/repository-picker";
import type { ProviderConnection, Repository } from "@/lib/types";

interface TokenScopeDialogProps {
  /** Trigger element rendered by the caller. */
  children: ReactNode;
  connections: ProviderConnection[];
  initialName?: string;
  initialRepositoryIds?: string[];
  mode: "create" | "edit";
  onSubmit: (values: { name: string; repositoryIds: string[] }) => void;
  repositories: Repository[];
}

const COPY = {
  create: {
    action: "Create token",
    description:
      "The secret is shown once, right after creation. Scope it to the repositories whose pipelines need it.",
    heading: "New CI/CD token",
  },
  edit: {
    action: "Save scope",
    description:
      "Repositories removed from the scope stop authenticating with this token immediately.",
    heading: "Edit token scope",
  },
} as const;

/** Shared form for creating a token and for editing the scope of an existing one. */
export function TokenScopeDialog({
  children,
  connections,
  initialName = "",
  initialRepositoryIds = [],
  mode,
  onSubmit,
  repositories,
}: TokenScopeDialogProps) {
  const [name, setName] = useState(initialName);
  const [repositoryIds, setRepositoryIds] = useState(initialRepositoryIds);

  const copy = COPY[mode];
  const isValid = name.trim().length > 0 && repositoryIds.length > 0;

  const resetForm = () => {
    setName(initialName);
    setRepositoryIds(initialRepositoryIds);
  };

  return (
    <Modal>
      {children}
      <Modal.Backdrop
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            resetForm();
          }
        }}
      >
        <Modal.Container>
          <Modal.Dialog className="sm:max-w-[520px]">
            {({ close }) => (
              <>
                <Modal.CloseTrigger />
                <Modal.Header>
                  <Modal.Heading>{copy.heading}</Modal.Heading>
                </Modal.Header>
                <Modal.Body className="flex flex-col gap-5">
                  <p className="text-sm text-muted">{copy.description}</p>
                  <TextField
                    autoComplete="off"
                    isDisabled={mode === "edit"}
                    value={name}
                    onChange={setName}
                  >
                    <Label>Token name</Label>
                    <Input placeholder="Storefront deploys" variant="secondary" />
                    <Description>
                      Shown in audit logs so a failing pipeline is easy to trace.
                    </Description>
                  </TextField>
                  <div className="flex flex-col gap-2">
                    <Label>Repository scope</Label>
                    <RepositoryPicker
                      connections={connections}
                      repositories={repositories}
                      value={repositoryIds}
                      onChange={setRepositoryIds}
                    />
                    <p className="text-xs text-muted">
                      {repositoryIds.length} repositor
                      {repositoryIds.length === 1 ? "y" : "ies"} selected
                    </p>
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button slot="close" variant="tertiary">
                    Cancel
                  </Button>
                  <Button
                    isDisabled={!isValid}
                    onPress={() => {
                      onSubmit({ name: name.trim(), repositoryIds });
                      close();
                    }}
                  >
                    {copy.action}
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
