"use client";

import dynamic from "next/dynamic";

// WalletMultiButton reads wallet state that only exists in the browser, so
// server-rendering it produces markup that never matches the client. Loading it
// with ssr:false is the supported way to avoid the hydration mismatch.
export const WalletButton = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  {
    ssr: false,
    loading: () => (
      <div className="h-12 w-44 animate-pulse rounded-md bg-black/10 dark:bg-white/10" />
    ),
  },
);
