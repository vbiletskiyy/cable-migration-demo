#!/bin/bash
set -e

echo "📦 Running bundle install..."
bundle check || bundle install

if [ ! -f tmp/pids/server.pid ]; then
  echo "🚀 Starting server..."
else
  echo "🧹 Removing stale server PID..."
  rm -f tmp/pids/server.pid
fi

exec "$@"
