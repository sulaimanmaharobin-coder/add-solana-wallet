# MEMORY.md

Essential facts about the user's workflow. Keep this to items that materially affect how work is done.

## Tools

- Uses the **trader-dev MCP server** (HTTP transport, `https://mcp.trader.dev/mcp`), added at user scope on their own machine with `claude mcp add`. The access key lives in the URL query string in the local `~/.claude.json`; never copy the key into files or chat. It is not available inside cloud sessions unless configured through claude.ai connectors or environment settings.
- Uses Claude Code with the **tradingview-mcp** server (own fork, `sulaimanmaharobin-coder/tradingview-mcp`) on **Claude Opus 5.5**.

## Breakout scan routine

- Daily cloud routine "Daily breakout scan" (`trig_01DoUfazaoatNMDFfD7zuoQh`) runs at 08:10 SGT in a fresh session: EMA 20/50 scan of Crypto.com Exchange USD pairs, publishes a private "Breakout Scan <date>" artifact and sends the TL;DR through the routine's completion push. Routine sessions have no push tool, so the run's final reply is the push text; don't ask the run to send a push itself. The prompt is self-contained and its source is `routines/breakout_scan_prompt.md`; when changing it, edit that file and push the same text to the routine with `update_trigger`.
- Current rules: 14-day range cap 50% for FRESH-CROSS/IN-TREND, default stop 10%. The real stop is set in jev-trader on the user's laptop, not in the routine.
- The HELD list (coins excluded from the scan) is typed into the prompt and must be updated by hand when holdings change; last updated 2026-09-29. Cloud sessions cannot read the Crypto.com account.
- Backtest Aug 2025 to Sep 2026: the gate beat buy-and-hold only by staying out of a falling market; its entries lost money. Treat signals as a watch list, not buys.

## Portfolio

- 2026-09-29: decided to rotate all BTC, ETH and other non-ISO coins into XLM, HBAR, ALGO and ADA in three stages; keep XRP; do not buy QNT. The plan is in `plans/iso_rotation_2026-09-29.md` (orders entered by hand in jev-trader). The list of other coins to sell is still to come from the user. Update the routine's HELD list once orders fill.

## Billing

- Uses Claude through a **subscription**, not per-token API billing. Context size and background model calls cost usage limits, not money; weigh cost changes against limits.
- Chose not to run claude-mem or the document-skills plugin in this repo, to save usage limits. Don't re-add them without asking.
- Evals run through an Anthropic API key (billed per token, separate from the subscription), stored as the `ANTHROPIC_API_KEY` environment secret.
