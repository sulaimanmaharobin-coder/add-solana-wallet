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

## After fills

Update the HELD list in `routines/breakout_scan_prompt.md` and push it to the routine with `update_trigger`. Remove BTC, ETH, SOL, LINK, AVAX, DOGE, LTC, ARB, DOT, FIL and WLD once sold. Add XLM and ALGO only once they fill. ADA, HBAR, VET and XRP stay.
