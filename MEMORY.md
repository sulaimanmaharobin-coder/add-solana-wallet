# MEMORY.md

Essential facts about the user's workflow. Keep this to items that materially affect how work is done.

## Tools

- Uses the **trader-dev MCP server** (HTTP transport, `https://mcp.trader.dev/mcp`), added at user scope on their own machine with `claude mcp add`. The access key lives in the URL query string in the local `~/.claude.json`; never copy the key into files or chat. It is not available inside cloud sessions unless configured through claude.ai connectors or environment settings.

## Claude Code defaults

- Project `.claude/settings.json` in this repo pins `model` to `claude-opus-5` and `effortLevel` to `high`, so sessions here start on Opus 5 at high effort. This overrides the general Sonnet-first habit for this repository.
- The same file sets `env.CLAUDE_CODE_SUBAGENT_MODEL` to `opus`, so subagents spawned in this repo also run on Opus.
