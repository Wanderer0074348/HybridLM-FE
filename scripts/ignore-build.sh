#!/bin/bash

# Only build on main branch
if [[ "$VERCEL_GIT_COMMIT_REF" != "main" ]] ; then
  echo "🛑 Not main branch - Build cancelled"
  exit 0;
else
  echo "✅ Main branch detected - Proceeding with build"
  exit 1;
fi
