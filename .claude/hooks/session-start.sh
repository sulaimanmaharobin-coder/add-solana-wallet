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

echo "Session start hook: npm dependencies installed, Next.js types generated."
