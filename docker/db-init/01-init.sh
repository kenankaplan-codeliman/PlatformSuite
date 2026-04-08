#!/bin/bash
# Run schema scripts in dependency order
set -e

SCRIPTS_DIR="/sql"

echo "Running database initialization scripts..."

for script in \
    "$SCRIPTS_DIR/Identity.sql" \
    "$SCRIPTS_DIR/Contact.sql" \
    "$SCRIPTS_DIR/Lead.sql" \
    "$SCRIPTS_DIR/products.sql" \
    "$SCRIPTS_DIR/Account.sql" \
    "$SCRIPTS_DIR/opportunities.sql" \
    "$SCRIPTS_DIR/Activity.sql" \
    "$SCRIPTS_DIR/Logs.sql"
do
    echo "Executing: $script"
    psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" -f "$script"
done

echo "Database initialization complete."
