# ISO coin rotation: staged order plan for jev-trader

Drafted 2026-09-29 from Crypto.com Exchange USD daily candles (prices as of about 10:40 UTC). Enter the orders by hand in jev-trader. Re-check prices before placing anything; levels older than a day should be reset.

## Decision

Sell all BTC and ETH, plus the other non-ISO coins listed below, and buy XLM, HBAR, ALGO and ADA. Keep XRP. Do not buy QNT: it went from $70 to $368 in four days and is now around $250, so most of the move has already happened.

## Where prices stand

| Coin | Last | Mid-Aug | Change | 14-day range | Avg daily volume (last 7d) | Note |
|---|---|---|---|---|---|---|
| BTC | 84,023 | 63,000 | +33% | 74,990 to 87,430 | ~$235M | Holding 83k to 85k for a week |
| ETH | 2,711 | 1,880 | +44% | 2,366 to 2,808 | ~$150M | Holding 2,630 to 2,790 |
| ADA | 0.2505 | 0.174 | +44% | 0.190 to 0.265 (39%) | ~$3.5M | Most liquid of the four |
| XLM | 0.2291 | 0.158 | +45% | 0.172 to 0.235 (36%) | ~$0.8M | Steady trend |
| HBAR | 0.1172 | 0.066 | +78% | 0.072 to 0.131 (82%) | ~$1.8M, $7.4M on 28 Sep | 27% spike on 28 Sep |
| ALGO | 0.1315 | 0.078 | +69% | 0.085 to 0.140 (65%) | ~$90k | Very thin order book |

HBAR and ALGO would fail your own breakout rule (14-day range cap of 50%). They are in the plan because you chose them, but they get smaller weights.

## Allocation of proceeds

ADA 35%, XLM 30%, HBAR 20%, ALGO 15%. The weights follow liquidity and how stretched each coin is. ALGO trades only about $90k a day, so split any ALGO order larger than about $2k into pieces placed over several hours, or it will move the price against you.

## Stage 1: day 1 (30% of proceeds)

First, sell 70% of your BTC, ETH and other non-ISO coins with limit orders at the bid (BTC about 84,000, ETH about 2,710). This covers stages 1 and 2. The remaining 30% stays in BTC/ETH until stage 3 triggers.

| Coin | Share of proceeds | Limit buy | Good for | Stop (10%) |
|---|---|---|---|---|
| ADA | 10.5% | 0.2480 | 48h | 0.2232 |
| XLM | 9.0% | 0.2270 | 48h | 0.2043 |
| HBAR | 6.0% | 0.1150 | 48h | 0.1035 |
| ALGO | 4.5% | 0.1300 | 48h | 0.1170 |

Any stage 1 order not filled after 48h is cancelled, and its cash moves to stage 2.

## Stage 2: pullback buys, placed day 1 (40% of proceeds)

Resting limit orders near the bases each coin formed before the 28 Sep jump. They are valid for 7 days.

| Coin | Share of proceeds | Limit buy | Below last | Stop (10%) |
|---|---|---|---|---|
| ADA | 14% | 0.2380 | -5% | 0.2142 |
| XLM | 12% | 0.2150 | -6% | 0.1935 |
| HBAR | 8% | 0.1000 | -15% | 0.0900 |
| ALGO | 6% | 0.1200 | -9% | 0.1080 |

If a stage 2 order has not filled by day 7, cancel it and keep that cash in USD. Do not chase.

## Stage 3: confirmation buys (30% of proceeds)

Only after a daily close (UTC) above the level below, within 14 days. When a coin triggers, sell the matching share of the remaining BTC/ETH and buy that coin at market the next morning. Put a 10% stop under the fill.

| Coin | Share of proceeds | Trigger: daily close above |
|---|---|---|
| ADA | 10.5% | 0.2655 |
| XLM | 9.0% | 0.2350 |
| HBAR | 6.0% | 0.1310 |
| ALGO | 4.5% | 0.1405 |

If a coin has not triggered by 13 Oct, keep its share in BTC/ETH.

## Kill switch

If QNT closes a day below $150 (about half of its spike), treat the ISO story as unwinding: cancel all open stage 2 and stage 3 orders and keep the rest in BTC/ETH or USD. Stops already placed stay in force.

## Other non-ISO coins to sell

To fill in: coin, amount. These are sold with BTC/ETH on the same 70/30 split.

| Coin | Amount held | Sell day 1 (70%) | Hold for stage 3 (30%) |
|---|---|---|---|
| | | | |

## After fills

Update the HELD list in `routines/breakout_scan_prompt.md` and push it to the routine with `update_trigger`, so the daily scan stops flagging coins you now hold.
