#!/bin/bash
# Initialize crm_db with Platform shared schemas + Crm.Database SQL.
# Runs once on first volume mount.
set -e

DB=crm_db
echo "Initializing $DB"

run() {
  echo "  → $1"
  psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$DB" -f "$1"
}

# Platform shared schemas (numeric prefix order — natural lexical sort)
for f in /sql/platform/*.sql; do
  [ -f "$f" ] && run "$f"
done

# CRM-specific schemas
for f in /sql/crm/*.sql; do
  [ -f "$f" ] && run "$f"
done

echo "$DB ready."
