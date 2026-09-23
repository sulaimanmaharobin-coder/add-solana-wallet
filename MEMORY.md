# MEMORY.md

Essential facts about the user's workflow. Keep this to items that materially affect how work is done.

## Tools

- Uses the **trader-dev MCP server** (HTTP transport, `https://mcp.trader.dev/mcp`), added at user scope on their own machine with `claude mcp add`. The access key lives in the URL query string in the local `~/.claude.json`; never copy the key into files or chat. It is not available inside cloud sessions unless configured through claude.ai connectors or environment settings.
- Uses Claude Code with the **tradingview-mcp** server (own fork, `sulaimanmaharobin-coder/tradingview-mcp`) on **Claude Opus 5.5**.

## Billing

- Uses Claude through a **subscription**, not per-token API billing. Context size and background model calls cost usage limits, not money; weigh cost changes against limits.
- Chose not to run claude-mem or the document-skills plugin in this repo, to save usage limits. Don't re-add them without asking.
- Evals run through an Anthropic API key (billed per token, separate from the subscription), stored as the `ANTHROPIC_API_KEY` environment secret.
