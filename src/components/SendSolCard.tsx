"use client";

import { useState } from "react";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

import { Button, Card, StatusLine, errorMessage, type Status } from "./ui";

export function SendSolCard() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction, connected } = useWallet();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("0.01");
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function onSend() {
    if (!publicKey) return;

    let destination: PublicKey;
    try {
      destination = new PublicKey(recipient.trim());
    } catch {
      setStatus({ kind: "error", message: "That is not a valid address." });
      return;
    }

    const sol = Number(amount);
    if (!Number.isFinite(sol) || sol <= 0) {
      setStatus({ kind: "error", message: "Enter an amount greater than zero." });
      return;
    }

    setStatus({ kind: "busy", message: "Waiting for the wallet…" });
    try {
      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash();

      const transaction = new Transaction({
        feePayer: publicKey,
        blockhash,
        lastValidBlockHeight,
      }).add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: destination,
          lamports: Math.round(sol * LAMPORTS_PER_SOL),
        }),
      );

      const signature = await sendTransaction(transaction, connection);
      setStatus({ kind: "busy", message: "Confirming…" });

      const result = await connection.confirmTransaction(
        { signature, blockhash, lastValidBlockHeight },
        "confirmed",
      );
      if (result.value.err) {
        throw new Error(`Transaction failed: ${JSON.stringify(result.value.err)}`);
      }

      setStatus({ kind: "ok", message: `Sent ${sol} SOL.`, signature });
    } catch (err) {
      setStatus({ kind: "error", message: errorMessage(err, "Transfer failed") });
    }
  }

  const busy = status.kind === "busy";

  return (
    <Card
      title="Send devnet SOL"
      description="Builds a transfer, hands it to the wallet to sign, and waits for confirmation."
    >
      <div className="flex flex-col gap-3">
        <input
          className="rounded-md border border-black/15 bg-transparent px-3 py-2 font-mono text-sm dark:border-white/20"
          placeholder="Recipient address"
          value={recipient}
          onChange={(event) => setRecipient(event.target.value)}
          aria-label="Recipient address"
        />
        <div className="flex gap-3">
          <input
            className="w-32 rounded-md border border-black/15 bg-transparent px-3 py-2 text-sm dark:border-white/20"
            type="number"
            min="0"
            step="0.001"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            aria-label="Amount in SOL"
          />
          <Button onClick={onSend} disabled={!connected || busy}>
            {busy ? "Sending…" : "Send"}
          </Button>
        </div>
      </div>
      <StatusLine status={status} />
    </Card>
  );
}
