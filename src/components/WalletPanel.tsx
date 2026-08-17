"use client";

import { useState } from "react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

import { useSolBalance } from "@/hooks/useSolBalance";
import { SendSolCard } from "./SendSolCard";
import { SignMessageCard } from "./SignMessageCard";
import { Button, Card, StatusLine, errorMessage, type Status } from "./ui";

export function WalletPanel() {
  const { connection } = useConnection();
  const { publicKey, wallet, connected } = useWallet();
  const { balance, error: balanceError, refresh } = useSolBalance();
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  if (!connected || !publicKey) {
    return (
      <Card
        title="No wallet connected"
        description="Use the button above to connect. Any wallet that implements the Wallet Standard — Phantom, Solflare, Backpack — shows up automatically once its extension is installed."
      >
        <p className="text-sm opacity-60">
          Set the wallet to devnet before connecting, or it will report balances
          from a cluster this app is not talking to.
        </p>
      </Card>
    );
  }

  async function onAirdrop() {
    if (!publicKey) return;
    setStatus({ kind: "busy", message: "Requesting 1 SOL…" });
    try {
      const signature = await connection.requestAirdrop(
        publicKey,
        LAMPORTS_PER_SOL,
      );
      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash();
      await connection.confirmTransaction(
        { signature, blockhash, lastValidBlockHeight },
        "confirmed",
      );
      await refresh();
      setStatus({ kind: "ok", message: "Airdropped 1 SOL.", signature });
    } catch (err) {
      setStatus({
        kind: "error",
        message: `${errorMessage(err, "Airdrop failed")} — the public devnet faucet is rate limited; faucet.solana.com is the reliable fallback.`,
      });
    }
  }

  const address = publicKey.toBase58();

  return (
    <div className="flex flex-col gap-4">
      <Card title="Account" description={wallet?.adapter.name}>
        <dl className="flex flex-col gap-3 text-sm">
          <div>
            <dt className="opacity-60">Address</dt>
            <dd className="mt-1 flex items-center gap-2">
              <code className="font-mono break-all">{address}</code>
              <button
                onClick={() => navigator.clipboard?.writeText(address)}
                className="shrink-0 rounded border border-black/15 px-2 py-0.5 text-xs opacity-70 hover:opacity-100 dark:border-white/20"
              >
                Copy
              </button>
            </dd>
          </div>
          <div>
            <dt className="opacity-60">Balance</dt>
            <dd className="mt-1 font-mono">
              {balanceError
                ? "unavailable"
                : balance === null
                  ? "…"
                  : `${balance.toLocaleString(undefined, { maximumFractionDigits: 9 })} SOL`}
            </dd>
          </div>
        </dl>
        {balanceError ? (
          <p className="mt-3 text-sm text-red-600 dark:text-red-400">
            {balanceError}
          </p>
        ) : null}
        <div className="mt-4">
          <Button onClick={onAirdrop} disabled={status.kind === "busy"}>
            Airdrop 1 SOL
          </Button>
        </div>
        <StatusLine status={status} />
      </Card>

      <SignMessageCard />
      <SendSolCard />
    </div>
  );
}
