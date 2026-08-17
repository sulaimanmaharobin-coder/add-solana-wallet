import type { ReactNode } from "react";

export function Card({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-black/10 bg-black/[.02] p-5 dark:border-white/15 dark:bg-white/[.03]">
      <h2 className="text-sm font-semibold tracking-tight">{title}</h2>
      {description ? (
        <p className="mt-1 text-sm opacity-60">{description}</p>
      ) : null}
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function Button({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  );
}

export type Status =
  | { kind: "idle" }
  | { kind: "busy"; message: string }
  | { kind: "ok"; message: string; signature?: string }
  | { kind: "error"; message: string };

export function StatusLine({
  status,
  cluster = "devnet",
}: {
  status: Status;
  cluster?: string;
}) {
  if (status.kind === "idle") return null;

  const tone =
    status.kind === "error"
      ? "text-red-600 dark:text-red-400"
      : status.kind === "ok"
        ? "text-green-700 dark:text-green-400"
        : "opacity-60";

  return (
    <p className={`mt-3 text-sm break-words ${tone}`}>
      {status.message}
      {status.kind === "ok" && status.signature ? (
        <>
          {" "}
          <a
            className="underline underline-offset-2"
            href={`https://explorer.solana.com/tx/${status.signature}?cluster=${cluster}`}
            target="_blank"
            rel="noreferrer"
          >
            View on explorer
          </a>
        </>
      ) : null}
    </p>
  );
}

export function errorMessage(err: unknown, fallback: string) {
  return err instanceof Error && err.message ? err.message : fallback;
}

/** Browser-safe base64 — `Buffer` is not polyfilled in the client bundle. */
export function toBase64(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}
