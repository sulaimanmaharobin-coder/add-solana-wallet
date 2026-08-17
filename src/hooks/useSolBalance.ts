"use client";

import { useCallback, useEffect, useState } from "react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

type Entry = { address: string; balance: number | null; error: string | null };

const EMPTY: Entry = { address: "", balance: null, error: null };

/**
 * Tracks the connected wallet's SOL balance, seeding it with a one-off fetch and
 * then keeping it current from an account subscription so airdrops and transfers
 * show up without a manual refresh.
 */
export function useSolBalance() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [entry, setEntry] = useState<Entry>(EMPTY);

  const address = publicKey?.toBase58() ?? null;

  // Stored readings are tagged with the address they came from, so switching or
  // disconnecting a wallet drops the previous balance without an extra render.
  const current = address && entry.address === address ? entry : EMPTY;

  const refresh = useCallback(async () => {
    if (!publicKey) return;
    const owner = publicKey.toBase58();
    try {
      const lamports = await connection.getBalance(publicKey);
      setEntry({
        address: owner,
        balance: lamports / LAMPORTS_PER_SOL,
        error: null,
      });
    } catch (err) {
      setEntry({
        address: owner,
        balance: null,
        error: err instanceof Error ? err.message : "Failed to fetch balance",
      });
    }
  }, [connection, publicKey]);

  useEffect(() => {
    if (!publicKey) return;

    const owner = publicKey.toBase58();
    let active = true;

    connection
      .getBalance(publicKey)
      .then((lamports) => {
        if (!active) return;
        setEntry({
          address: owner,
          balance: lamports / LAMPORTS_PER_SOL,
          error: null,
        });
      })
      .catch((err: unknown) => {
        if (!active) return;
        setEntry({
          address: owner,
          balance: null,
          error: err instanceof Error ? err.message : "Failed to fetch balance",
        });
      });

    const subscriptionId = connection.onAccountChange(publicKey, (account) => {
      setEntry({
        address: owner,
        balance: account.lamports / LAMPORTS_PER_SOL,
        error: null,
      });
    });

    return () => {
      active = false;
      connection.removeAccountChangeListener(subscriptionId).catch(() => {
        // The socket is already gone during teardown; nothing to clean up.
      });
    };
  }, [connection, publicKey]);

  return { balance: current.balance, error: current.error, refresh };
}
