import { WalletButton } from "@/components/WalletButton";
import { WalletPanel } from "@/components/WalletPanel";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-6 py-16">
      <header className="flex flex-col gap-4">
        <span className="w-fit rounded-full border border-black/10 px-3 py-1 text-xs font-medium tracking-wide uppercase opacity-70 dark:border-white/20">
          Devnet
        </span>
        <h1 className="text-3xl font-semibold tracking-tight">
          Solana wallet adapter
        </h1>
        <p className="text-sm opacity-70">
          Connect a browser wallet, read its balance, sign a message, and send a
          devnet transfer.
        </p>
        <div>
          <WalletButton />
        </div>
      </header>

      <WalletPanel />
    </main>
  );
}
