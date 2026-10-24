#!/bin/sh
# Rebuilds index.html from live Store data and pushes it if anything changed.
# Run after the daily publish job, so newly public Actors appear on the site the same evening.
set -e
cd "$(dirname "$0")"
"/c/Program Files/nodejs/node.exe" build.mjs
if [ -n "$(git status --porcelain index.html)" ]; then
    git add index.html
    git -c core.safecrlf=false commit -q -m "chore: refresh actor list"
    git push -q origin main
    echo "site updated"
else
    echo "site unchanged"
fi
