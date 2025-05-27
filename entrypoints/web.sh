#!/bin/bash
set -e

echo "📦 Running bundle install..."
bundle check || bundle install

if [ -f tmp/pids/server.pid ]; then
  echo "🧹 Removing stale server PID..."
  rm -f tmp/pids/server.pid
fi

echo "🚀 Starting AnyCable RPC server in background..."
bundle exec anycable --rpc-host 0.0.0.0:50051 &

echo "🚀 Starting Rails server..."
exec bundle exec rails server -b 0.0.0.0 -p 3000
