# add-solana-wallet

A Next.js app wired to Solana browser wallets through
[`@solana/wallet-adapter`](https://github.com/anza-xyz/wallet-adapter), pointed at
**devnet**.

It connects a wallet, reads the balance, signs a message, and sends a transfer —
the four things almost every Solana frontend needs.

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:3000. You will need a browser wallet extension
(Phantom, Solflare, Backpack, …) **set to devnet** — the app talks only to
devnet, so a wallet left on mainnet will report a balance from a cluster this app
is not reading.

Fund the account with the in-app *Airdrop 1 SOL* button, or from
[faucet.solana.com](https://faucet.solana.com) when the public faucet rate-limits
you.

## Configuration

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SOLANA_RPC_ENDPOINT` | no | Devnet RPC endpoint. Defaults to `clusterApiUrl("devnet")`. |

Copy `.env.example` to `.env.local` to set it. The default public devnet endpoint
is rate-limited hard enough to be disruptive during real development, so point
this at a dedicated devnet RPC (Helius, QuickNode, Triton) as soon as you are
doing more than clicking around.

## How it fits together

```
src/app/layout.tsx           wraps the tree in WalletProviders
src/components/
  WalletProviders.tsx        ConnectionProvider → WalletProvider → WalletModalProvider
  WalletButton.tsx           WalletMultiButton, loaded with ssr:false
  WalletPanel.tsx            connected/disconnected split, address, balance, airdrop
  SignMessageCard.tsx        signMessage()
  SendSolCard.tsx            build → sendTransaction() → confirm
  ui.tsx                     small shared presentational pieces
src/hooks/useSolBalance.ts   balance fetch + account subscription
```

Two details in there are deliberate and easy to get wrong:

**The `wallets` array is empty.** Phantom, Solflare, Backpack and every other
current wallet implement the
[Wallet Standard](https://github.com/wallet-standard/wallet-standard), which
`WalletProvider` discovers from the browser on its own. You only need an explicit
adapter for a wallet that predates the standard. Passing the
`@solana/wallet-adapter-wallets` meta-package instead pulls in ~940 extra
packages of mostly deprecated adapters — it was installed during development and
removed for exactly that reason.

**`WalletMultiButton` is loaded with `ssr: false`.** It renders from wallet state
that only exists in the browser, so server-rendering it produces markup that
never matches the client and React throws a hydration mismatch.

## Known third-party request

`@solana/wallet-adapter-react-ui/styles.css` `@import`s DM Sans from Google Fonts
at runtime. If you have a CSP or a no-third-party-requests policy, drop that
stylesheet import in `WalletProviders.tsx` and style the button yourself, or
self-host the font.

## Dependency advisories

`npm audit` reports two transitive advisories with no fix available upstream.
Both are build-tree only and neither reaches the browser bundle:

- `image-size` (DoS) — arrives via `react-native` → `metro`, pulled in by
  `@solana-mobile/wallet-adapter-mobile`, a dependency of
  `@solana/wallet-adapter-react`. Metro never ships in a web build.
- `uuid` (missing buffer bounds check) — via `jayson` and `rpc-websockets` under
  `@solana/web3.js`.

## Scripts

```bash
npm run dev       # dev server
npm run build     # production build
npm run lint      # eslint
npx tsc --noEmit  # typecheck
```
