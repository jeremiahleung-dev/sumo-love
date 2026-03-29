#!/bin/bash
set -euo pipefail

# Only run in remote (Claude Code on the web) sessions
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR"

# Install all dependencies (postinstall runs prisma generate automatically)
npm install

# Type-check to surface any issues early
npx tsc --noEmit
