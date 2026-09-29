# ISO coin rotation: staged order plan for jev-trader

Drafted 2026-09-29 from Crypto.com Exchange USD tickers and daily candles (prices as of about 10:55 UTC). Enter the orders by hand in jev-trader. Re-check prices before placing anything; levels older than a day should be reset.

## Decision

Sell BTC, ETH and the other non-ISO coins below, and buy XLM, HBAR, ALGO and ADA. Keep XRP, VET and the existing ADA and HBAR. Do not buy QNT: it went from $70 to $368 in four days and is now around $260, so most of the move has already happened.

## Where prices stand

| Coin | Last | Mid-Aug | Change | 14-day range | Avg daily volume (last 7d) | Note |
|---|---|---|---|---|---|---|
| ADA | 0.2505 | 0.174 | +44% | 0.190 to 0.265 (39%) | ~$3.5M | Most liquid of the four |
| XLM | 0.2291 | 0.158 | +45% | 0.172 to 0.235 (36%) | ~$0.8M | Steady trend |
| HBAR | 0.1172 | 0.066 | +78% | 0.072 to 0.131 (82%) | ~$1.8M, $7.4M on 28 Sep | 27% spike on 28 Sep |
| ALGO | 0.1315 | 0.078 | +69% | 0.085 to 0.140 (65%) | ~$90k | Thin order book |

HBAR and ALGO would fail your own breakout rule (14-day range cap of 50%). They are in the plan because you chose them, but they get smaller weights.

## Step 1: sell, day 1

Sell every coin in the table at the bid in one order each. Total is about $1,601 before fees; the plan below uses $1,595. VET is kept. The holdings are small enough that splitting the sells adds fees without cutting risk, so the proceeds sit in USD and only the buys are staged.

| Coin | Amount | Bid | Value |
|---|---|---|---|
| DOT | 260 | 1.2032 | $313 |
| WLD | 544 | 0.4975 | $271 |
| FIL | 221 | 1.0747 | $238 |
| LINK | 6.8 | 15.304 | $104 |
| AVAX | 9.0 | 11.515 | $104 |
| ETH | 0.037 | 2,710.39 | $100 |
| BTC | 0.0011744 | 83,988.67 | $99 |
| ARB | 462 | 0.2082 | $96 |
| LTC | 1.39 | 68.718 | $96 |
| SOL | 0.78 | 119.39 | $93 |
| DOGE | 931 | 0.09495 | $88 |
| **Total** | | | **$1,601** |

LINK (+10%) and AVAX (+10%) are up on the day, so these sells are into strength.

## Allocation of proceeds

ADA 35% ($558), XLM 30% ($479), HBAR 20% ($319), ALGO 15% ($239). The weights follow liquidity and how stretched each coin is.

## Stage 1: day 1, after the sells ($479, 30%)

| Coin | USD | Limit buy | Approx qty | Good for | Stop (10%) |
|---|---|---|---|---|---|
| ADA | $167 | 0.2480 | 673 | 48h | 0.2232 |
| XLM | $144 | 0.2270 | 634 | 48h | 0.2043 |
| HBAR | $96 | 0.1150 | 835 | 48h | 0.1035 |
| ALGO | $72 | 0.1300 | 554 | 48h | 0.1170 |

Any stage 1 order not filled after 48h is cancelled, and its cash moves to stage 2.

## Stage 2: pullback buys, placed day 1 ($639, 40%)

Resting limit orders near the bases each coin formed before the 28 Sep jump. They are valid for 7 days.

| Coin | USD | Limit buy | Approx qty | Below last | Stop (10%) |
|---|---|---|---|---|---|
| ADA | $223 | 0.2380 | 937 | -5% | 0.2142 |
| XLM | $192 | 0.2150 | 893 | -6% | 0.1935 |
| HBAR | $128 | 0.1000 | 1,280 | -15% | 0.0900 |
| ALGO | $96 | 0.1200 | 800 | -9% | 0.1080 |

If a stage 2 order has not filled by day 7, cancel it and keep that cash in USD. Do not chase.

## Stage 3: confirmation buys ($477, 30%)

Only after a daily close (UTC) above the level below, within 14 days. When a coin triggers, buy it at market from the USD reserve the next morning. Put a 10% stop under the fill.

| Coin | USD | Trigger: daily close above |
|---|---|---|
| ADA | $168 | 0.2655 |
| XLM | $143 | 0.2350 |
| HBAR | $95 | 0.1310 |
| ALGO | $71 | 0.1405 |

If a coin has not triggered by 13 Oct, the cash for it stays in USD. You then decide whether to hold it, buy BTC with it, or add to what did fill.

## Kill switch

If QNT closes a day below $150 (about half of its spike), treat the ISO story as unwinding: cancel all open stage 2 and stage 3 orders and keep the cash. Stops already placed stay in force.

## Scan check (added 2026-09-29, daily close of 28 Sep UTC)

Breakout scan run at 13:26 UTC, page "Breakout Scan 2026-09-28". The XLM and ALGO rows come from an earlier run on the same close, before they were added to the HELD list. ADA and HBAR were already held, so no scan covers them. The order tables above are unchanged; the suggested changes at the end of this section are not applied.

Sell side. Every coin being sold is in an EMA uptrend. None is breaking down, so there is no reason to rush the sells, and none to hold them back.

| Coin | Label | EMA gap % | vs SMA200 % | 24h % | 7d % | 14d range % | EMA rule vs hold % (trades) |
|---|---|---|---|---|---|---|---|
| DOT | IN-TREND | 10.1 | 10 | -7.1 | -2 | 34 | 30 vs -39 (1) |
| BTC | IN-TREND | 5.6 | 17 | -1.2 | -4 | 15 | -3 vs -7 (3) |
| LINK | IN-TREND | 10.5 | 65 | 10.1 | 17 | 42 | 62 vs 26 (3) |
| FIL | IN-TREND | 11.2 | 26 | -6.7 | 8 | 42 | 9 vs -19 (2) |
| ETH | IN-TREND | 7.3 | 28 | -0.0 | -3 | 16 | 21 vs -9 (3) |
| SOL | IN-TREND | 10.0 | 40 | -2.6 | 0 | 26 | -1 vs -7 (6) |
| LTC | IN-TREND | 11.3 | 36 | -2.9 | 12 | 42 | 18 vs 2 (2) |
| DOGE | IN-TREND | 5.9 | 7 | -3.1 | -6 | 25 | -13 vs -25 (2) |
| WLD | CHASING | 8.1 | 35 | -10.1 | 7 | 50 | 44 vs 5 (2) |
| ARB | CHASING | 25.2 | 87 | -10.9 | -11 | 55 | 72 vs 14 (2) |
| AVAX | CHASING | 13.6 | 31 | -3.0 | -6 | 56 | 25 vs -13 (2) |

Buy side.

| Coin | Label | EMA gap % | vs SMA200 % | 24h % | 7d % | 14d range % | EMA rule vs hold % (trades) |
|---|---|---|---|---|---|---|---|
| XLM | IN-TREND | 6.2 | 30 | 7.7 | 8 | 32 | -11 vs 10 (3) |
| ALGO | CHASING | 9.4 | 40 | 13.8 | 21 | 53 | 14 vs 13 (2) |

What this means:

- The rotation swaps coins in healthy trends for coins that have already run. That does not overturn the ISO decision, which was not made on trend, but it means buying at market on day 1 carries the most timing risk.
- XLM passes the entry gate. It is a later entry into an existing trend, not a fresh one.
- ALGO fails the gate on both the 7-day move (+21%) and the 14-day range (53%, on closes). Its stage 1 limit of 0.1300 is only about 1% under the 0.1315 last price, so stage 1 is effectively buying the spike.
- LINK is the strongest of the coins being sold (+10.1% on the day, 65% above SMA200). Selling it at the bid today is selling into strength, as the plan already notes.
- The backtest columns rest on 1 to 6 trades per coin. Treat them as context only.

Suggested changes (not applied; decide before placing orders):

1. Move ALGO's stage 1 amount ($72) into its stage 2 order at 0.1200, so all ALGO buys except stage 3 wait for a pullback.
2. Leave XLM's stage 1 order as it is. It passes the gate, and the 0.2270 limit is already below the last price.
3. Re-check the stage 1 limits against live prices before placing them. The levels here date from 10:55 UTC.

## After fills

HELD list: already switched on 2026-09-29 to the post-rotation set (XRP, VET, XLM, HBAR, ALGO, ADA) in `routines/breakout_scan_prompt.md` and in the routine. If the sells or buys do not all fill, edit that line to match what you actually hold, and push it to the routine with `update_trigger`.
