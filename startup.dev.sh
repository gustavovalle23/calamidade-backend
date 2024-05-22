#!/usr/bin/env bash
set -e

# /opt/wait-for-it.sh postgres:5432
npm run schema:sync
npm run migration:run
npm run seed:run
npm run start:dev
