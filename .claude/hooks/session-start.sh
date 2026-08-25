#!/bin/bash
# SessionStart hook: prepare the repo so lint/typecheck/build work immediately.
set -euo pipefail

# Local sessions manage their own node_modules; only bootstrap the fresh
# containers used by Claude Code on the web.
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)}"

echo "Installing npm dependencies..."
npm install --no-audit --no-fund

# next-env.d.ts and .next/types are gitignored build artifacts, but tsconfig.json
# includes them and app code uses the generated global helpers (LayoutProps,
# PageProps, RouteContext). Without them `npx tsc --noEmit` fails on a fresh
# clone, so generate them here rather than waiting for the first next dev/build.
echo "Generating Next.js route types..."
npx next typegen

echo "Setup complete."
