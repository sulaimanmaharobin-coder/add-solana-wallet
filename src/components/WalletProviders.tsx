"use client";

import { useMemo } from "react";
import { clusterApiUrl } from "@solana/web3.js";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";

import "@solana/wallet-adapter-react-ui/styles.css";

export const NETWORK = WalletAdapterNetwork.Devnet;

export function WalletProviders({ children }: { children: React.ReactNode }) {
  // A public devnet RPC is heavily rate limited. Point
  // NEXT_PUBLIC_SOLANA_RPC_ENDPOINT at a dedicated devnet endpoint for anything
  // beyond casual clicking around.
  const endpoint = useMemo(
    () => process.env.NEXT_PUBLIC_SOLANA_RPC_ENDPOINT ?? clusterApiUrl(NETWORK),
    [],
  );

  // Phantom, Solflare, Backpack and friends all implement the Wallet Standard,
  // which WalletProvider discovers from the browser on its own. Only wallets
  // that predate the standard need an explicit adapter in this array.
  const wallets = useMemo(() => [], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
