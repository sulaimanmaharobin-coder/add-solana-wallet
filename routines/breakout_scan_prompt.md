You run the daily EMA 20/50 breakout scan for the operator of jev-trader, who trades spot on the Crypto.com Exchange and reads your result on the Claude mobile app. This is research only: add no trade advice, sizes or prices of your own beyond the fixed wording in Steps 2 and 3, and never claim a coin will go up. Report the scan's labels exactly as computed. You have no access to the operator's account or repo; use only Crypto.com's public API (no keys).

STEP 1. Save the script below as scan.py and run it with `python3 scan.py`. It uses only the Python standard library. The script retries each API call once. If the ticker list still fails, the script exits with an error: the page must then say the scan failed and quote the error. If a single coin's candles fail, that coin is listed under 'skipped' and the scan continues. The output is JSON with last_close_utc, skipped and rows. Never invent or estimate a number.

```python
import json, time, urllib.request
B = 'https://api.crypto.com/exchange/v1/public/'
def get(method, **params):
    # One retry on any failure (network, non-JSON, empty data); then raise.
    q = '&'.join(f'{k}={v}' for k, v in params.items())
    url = B + method + ('?' + q if q else '')
    for attempt in (1, 2):
        try:
            with urllib.request.urlopen(url, timeout=30) as r:
                d = json.load(r)['result']['data']
            if not d: raise ValueError('empty data')
            return d
        except Exception as e:
            if attempt == 2: raise RuntimeError(f'{method} {params}: {e}')
            time.sleep(2)
# Coins the operator already holds (updated 2026-10-02 SGT; may be stale) and stablecoins: left out.
HELD = {'XRP','VET','XLM','HBAR','ADA'}
RANGE_CAP = 0.50  # max 14-day high/low range (closes) for FRESH-CROSS and IN-TREND
SKIP = {'USDT','USDC','DAI','PYUSD','FDUSD','TUSD','USD1','RLUSD','EURC','USDE','PAXG','XAUT','USAT'}
def ema(xs, n):
    a, e, out = 2 / (n + 1), xs[0], []
    for x in xs:
        e = a * x + (1 - a) * e; out.append(e)
    return out
rows, skipped = [], []
now_ms = time.time() * 1000
for t in get('get-tickers'):
    i = t['i']
    if not i.endswith('_USD') or '-' in i: continue
    coin = i[:-4]
    if coin in HELD or coin in SKIP: continue
    vol, b, k = float(t.get('vv') or 0), float(t.get('b') or 0), float(t.get('k') or 0)
    if vol < 25_000 or b <= 0 or k <= 0: continue
    spread = (k - b) / ((k + b) / 2) * 1e4
    if spread > 50: continue
    liquid = vol >= 100_000 and spread <= 25
    try:
        bars = get('get-candlestick', instrument_name=i, timeframe='1D', count=300)
    except RuntimeError as e:
        skipped.append(coin); continue
    # Keep only fully closed daily bars (t is the bar's open time, UTC ms).
    bars = sorted((x for x in bars if x['t'] + 86_400_000 <= now_ms), key=lambda x: x['t'])
    c = [float(x['c']) for x in bars]
    vu = [float(x['v']) * float(x['c']) for x in bars]
    time.sleep(0.1)
    if len(c) < 201: continue
    f, s = ema(c, 20), ema(c, 50)
    gap, gap5 = f[-1] / s[-1] - 1, f[-6] / s[-6] - 1
    since = next((len(c) - 1 - j for j in range(len(c) - 1, 0, -1) if (f[j] > s[j]) != (f[j-1] > s[j-1])), None)
    sma200 = sum(c[-201:-1]) / 200
    d1, d7 = c[-1] / c[-2] - 1, c[-1] / c[-8] - 1
    rng14 = max(c[-14:]) / min(c[-14:]) - 1
    gate = c[-1] > sma200 and d1 < 0.15 and d7 < 0.30 and rng14 < RANGE_CAP
    eq, pos, n = 1.0, False, 0
    for j in range(50, len(c)):
        up = f[j-1] > s[j-1]
        if pos: eq *= c[j] / c[j-1]
        if up and not pos: pos, n, eq = True, n + 1, eq * 0.995
        elif not up and pos: pos, eq = False, eq * 0.995
    if gap > 0:
        label = ('FRESH-CROSS' if since is not None and since < 3 else 'IN-TREND') if gate else ('CHASING' if c[-1] > sma200 else None)
    else:
        label = 'NEAR-CROSS' if gap > -0.02 and gap > gap5 else None
    if not liquid: label = None
    v30 = sum(vu[-37:-7]) / 30
    if not label and -0.015 <= gap <= 0.02 and -0.12 <= c[-1] / sma200 - 1 <= 0.03 and rng14 < 0.15 and abs(d7) < 0.10:
        label = 'QUIET-SETUP'
    if label:
        rows.append(dict(coin=coin, label=label, gap=round(gap*100,1), cross_days=since, vs_sma200=round((c[-1]/sma200-1)*100), d1=round(d1*100,1), d7=round(d7*100), spread=round(spread,1), vol_k=round(vol/1e3), rule=round((eq-1)*100), hold=round((c[-1]/c[50]-1)*100), trades=n, bt_days=len(c)-50, range14=round(rng14*100), vol_ratio=round(sum(vu[-7:]) / 7 / v30, 2) if v30 else None, last_close_utc=time.strftime('%Y-%m-%d', time.gmtime(bars[-1]['t']/1000))))
last_close = time.strftime('%Y-%m-%d', time.gmtime(now_ms / 1000 - 86400))
print(json.dumps(dict(last_close_utc=last_close, skipped=skipped, rows=rows), indent=1))
```

LABELS (explain these briefly on the page): FRESH-CROSS = EMA20 crossed above EMA50 within the last 3 closed daily bars and the entry gate passes (above SMA200, 24h < +15%, 7d < +30%, 14-day range < 50%, liquid). NEAR-CROSS = EMA20 still below EMA50 but within 2% and the gap narrowed over 5 days. IN-TREND = EMA up for longer, gate passes (a later entry into an existing trend). CHASING = EMA up and above SMA200 but fails the gate: up too much in 24h or 7d, or too volatile (14-day high/low range 50% or more). QUIET-SETUP (watch only) = the pattern QNT showed before its Sep 2026 spike: EMA gap between -1.5% and +2%, price from 12% below to 3% above SMA200, 14-day range under 15%, 7d move under 10%. It allows thinner coins (from $25K volume, spreads up to 50 bps), so it is never an entry signal. Most coins in this state never break out.

STEP 2. Publish ONE new private Artifact page (use the Artifact tool; quickstart with intent 'other', then a plain HTML page) titled 'Breakout Scan <last_close_utc>'. Publish exactly one page: write it to a single file (breakout-scan.html) and publish that path. If a publish call errors or seems to fail, publish the same file path again; never create a second page. Keep it short and phone-friendly:
- Top line TL;DR: 'Fresh up-cross: <coins or none>. Near a cross: <coins or none>. Quiet setups (watch only): <coins or none>.'
- If there is at least one FRESH-CROSS coin, a line under the TL;DR: 'To act on one: tell Claude on the laptop "add <COIN>" (default $150, 10% stop). Claude re-checks the rules and creates a buy proposal; nothing is bought until you say "approve".' Never add this line for QUIET-SETUP coins.
- One section per label in the order FRESH-CROSS, NEAR-CROSS, IN-TREND, CHASING, each a table with: Coin | EMA gap % | Last cross (days ago) | vs SMA200 % | 24h % | 7d % | 14d range % | Spread bps | 24h vol $K | EMA rule vs hold % (trades). Write 'none' for an empty section.
- Then a QUIET-SETUP (watch only) section, table: Coin | EMA gap % | vs SMA200 % | 14d range % | 7d % | Vol 7d vs 30d (x) | Spread bps | 24h vol $K. Mark rows with 24h vol under $100K or spread over 25 bps as 'thin'. Write 'none' if empty.
- Footer: 'Research only, not advice. Closed UTC daily candles from the Crypto.com Exchange public API. The backtest column covers up to ~8 months (fewer for newer coins) and usually only a few trades per coin: context, not proof. QUIET-SETUP is a watch list built from one past example (QNT); it is not a buy signal. Held coins are excluded; that list was last updated 2026-10-02 and may be stale.' If 'skipped' is not empty, add: 'Skipped after API errors: <coins>.'

STEP 3. Do not try to send a push notification yourself; this routine's completion notification delivers your final reply to the operator's phone. Make your final reply short plain text. If there is a FRESH-CROSS coin: 'Fresh up-cross: <coins>. To buy, tell Claude "add <first coin>" and approve the proposal. <page link>'. Otherwise: the TL;DR line and the page link. If the scan failed, say so in one line with the error and the page link.
