# MEMORY.md

Essential facts about the user's workflow. Keep this to items that materially affect how work is done.

## Tools

- Uses the **trader-dev MCP server** (HTTP transport, `https://mcp.trader.dev/mcp`), added at user scope on their own machine with `claude mcp add`. The access key lives in the URL query string in the local `~/.claude.json`; never copy the key into files or chat. It is not available inside cloud sessions unless configured through claude.ai connectors or environment settings.
- 2026-09-29: wants jev-trader usable from the phone both ways: (1) live laptop session via Remote Control (`claude remote-control` in the jev-trader folder, then the phone's Code tab), and (2) laptop-off use, which needs trader-dev added as a claude.ai connector at https://claude.ai/customize/connectors (connectors load at session start). The pairing must be done on the laptop and phone; cloud sessions cannot do it.
- Uses Claude Code with the **tradingview-mcp** server (own fork, `sulaimanmaharobin-coder/tradingview-mcp`) on **Claude Opus 5.5**.

## Breakout scan routine

- Daily cloud routine "Daily breakout scan" (`trig_01DoUfazaoatNMDFfD7zuoQh`) runs at 08:10 SGT in a fresh session: EMA 20/50 scan of Crypto.com Exchange USD pairs, publishes a private "Breakout Scan <date>" artifact and sends the TL;DR through the routine's completion push. Routine sessions have no push tool, so the run's final reply is the push text; don't ask the run to send a push itself. The prompt is self-contained and its source is `routines/breakout_scan_prompt.md`; when changing it, edit that file and push the same text to the routine with `update_trigger`.
- An older routine "jev-trader daily breakout scan" (`trig_01Kfis1MebWULyKxiDJcxTQU`, 08:30 SGT, stale 2026-09-25 HELD list, no range cap, 15% stop) is disabled and must stay disabled, because running alongside the current routine it publishes a duplicate scan page. It was created via the API, so agents cannot edit, enable or delete it.
- Current rules: 14-day range cap 50% for FRESH-CROSS/IN-TREND, default stop 10%. The real stop is set in jev-trader on the user's laptop, not in the routine.
- The HELD list (coins excluded from the scan) is typed into the prompt and must be updated by hand when holdings change; last updated 2026-10-02 to XRP, VET, XLM, HBAR, ADA after the user confirmed stage 1 fills. ALGO is not held, so it appears in the scan again. Cloud sessions cannot read the Crypto.com account.
- Backtest Aug 2025 to Sep 2026: the gate beat buy-and-hold only by staying out of a falling market; its entries lost money. Treat signals as a watch list, not buys.

## Portfolio

- 2026-09-29: decided to rotate all BTC, ETH and other non-ISO coins into XLM, HBAR, ALGO and ADA in three stages; keep XRP and VET; do not buy QNT. The plan is in `plans/iso_rotation_2026-09-29.md` (orders entered by hand in jev-trader). The portfolio is small (the 11 coins sold came to about $1.6k), so fees and order minimums matter more than fine-grained staging.
- 2026-09-29: ALGO failed the scan's entry gate (CHASING: 7d +21%, 14d range 53%), so there is no ALGO buy in stage 1. Its $72 moved into the stage 2 pullback order at 0.1200 ($168 in total, stop 0.1080). ALGO is bought only on a pullback within 7 days or a close above 0.1405 within 14 days; otherwise its $239 stays in USD.
- 2026-09-29: user is usually on the go and wants to place the rotation orders from the phone. Advised route: enter them by hand in the Crypto.com Exchange mobile app (same account as jev-trader), using Claude on the phone only to re-check prices. Cloud sessions have market data only and cannot place orders.
- 2026-09-30: all 11 sells filled and stage 1 (ADA, XLM, HBAR) filled; available USD $1,070 with the ALGO stage 2 order (0.1200) resting. Remaining stage 2 orders sized at ADA 929 @ 0.2380, XLM 884 @ 0.2150, HBAR 1,337 @ 0.0950; about $532 kept in USD for stage 3.
- HELD list follow-up: 2026-10-02: user confirmed stage 1 filled ADA, XLM and HBAR; ALGO did not fill. The stage 2 check-in (`trig_0136VJRcdKDBzo7Yz9A2bh3J`) fires 2026-10-06 22:30 UTC. Each one checks whether prices reached the limit levels, asks the user what actually filled, then sets HELD to the real holdings. HELD is only changed on the user's confirmation, never on price data alone.

## Billing

- Uses Claude through a **subscription**, not per-token API billing. Context size and background model calls cost usage limits, not money; weigh cost changes against limits.
- Chose not to run claude-mem or the document-skills plugin in this repo, to save usage limits. Don't re-add them without asking.
- Evals run through an Anthropic API key (billed per token, separate from the subscription), stored as the `ANTHROPIC_API_KEY` environment secret.
