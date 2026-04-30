#!/bin/bash
# Initialize codepro_db with Platform shared schemas + CodePro.Database SQL.
# Runs once on first volume mount.
set -e

DB=codepro_db
echo "Initializing $DB"

run() {
  echo "  → $1"
  psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$DB" -f "$1"
}

# Platform shared schemas (numeric prefix order — natural lexical sort)
for f in /sql/platform/*.sql; do
  [ -f "$f" ] && run "$f"
done

# CodePro-specific schemas (numeric prefix order — natural lexical sort)
for f in /sql/codepro/*.sql; do
  [ -f "$f" ] && run "$f"
done

echo "$DB ready."
