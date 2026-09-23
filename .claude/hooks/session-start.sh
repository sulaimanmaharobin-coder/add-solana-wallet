#!/bin/bash
set -euo pipefail

# Only needed in Claude Code on the web; local machines keep their own setup.
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)}"

echo "[session-start] Installing project dependencies..." >&2
npm install >&2

# tsconfig.json includes .next/types; without this, `npx tsc --noEmit` fails
# on Next-generated globals like LayoutProps until a build or dev run.
npx next typegen >&2

# claude-mem installs into the container's home directory, which does not
# survive between remote sessions — reinstall unless this container has it.
if [ ! -d "$HOME/.claude/plugins/marketplaces/thedotmack" ]; then
  echo "[session-start] Installing claude-mem..." >&2
  npx --yes claude-mem install >&2
fi

# Worker autostart is skipped in non-TTY shells, so start it explicitly.
mem_status="claude-mem installed and its worker is running"
if ! npx claude-mem start >&2; then
  echo "[session-start] warning: claude-mem worker failed to start" >&2
  mem_status="claude-mem worker FAILED to start, so its memory tools are unavailable this session"
fi

echo "Session start hook: npm dependencies installed, Next.js types generated; ${mem_status}."
