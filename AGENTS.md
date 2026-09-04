<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## gstack

This project uses [gstack](https://github.com/garrytan/gstack) for AI-assisted
workflows. In Claude Code on the web it is installed automatically by the
SessionStart hook (`.claude/hooks/session-start.sh`); on a local machine,
install it with:

```bash
git clone --single-branch --depth 1 https://github.com/garrytan/gstack.git ~/.claude/skills/gstack
cd ~/.claude/skills/gstack && ./setup
```

For web browsing use gstack's /browse skill rather than the Claude-in-Chrome
MCP tools: gstack's QA, design-review and cookie-setup skills all drive its own
browse binary, and the Chrome MCP tools are slower and less reliable for that.

The installed gstack skills appear in the session's skill list; the full
catalog is in ~/.claude/skills/gstack/README.md.

Use ~/.claude/skills/gstack/... for gstack file paths.
