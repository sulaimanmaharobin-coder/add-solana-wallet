"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

import {
  Button,
  Card,
  StatusLine,
  errorMessage,
  toBase64,
  type Status,
} from "./ui";

export function SignMessageCard() {
  const { signMessage, connected } = useWallet();
  const [message, setMessage] = useState("Hello from add-solana-wallet");
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function onSign() {
    if (!signMessage) return;
    setStatus({ kind: "busy", message: "Waiting for the wallet…" });
    try {
      const signature = await signMessage(new TextEncoder().encode(message));
      setStatus({
        kind: "ok",
        message: `Signature (base64): ${toBase64(signature)}`,
      });
    } catch (err) {
      setStatus({ kind: "error", message: errorMessage(err, "Signing failed") });
    }
  }

  return (
    <Card
      title="Sign a message"
      description="Proves the user controls the key without touching the chain — the usual basis for wallet sign-in."
    >
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          className="flex-1 rounded-md border border-black/15 bg-transparent px-3 py-2 text-sm dark:border-white/20"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          aria-label="Message to sign"
        />
        <Button onClick={onSign} disabled={!connected || !signMessage}>
          Sign
        </Button>
      </div>
      {connected && !signMessage ? (
        <p className="mt-3 text-sm opacity-60">
          This wallet does not expose message signing.
        </p>
      ) : null}
      <StatusLine status={status} />
    </Card>
  );
}
