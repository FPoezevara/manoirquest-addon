#!/usr/bin/with-contenv bashio

# ── Config from HAOS options ─────────────────────────────────────────────
DATA_PATH=$(bashio::config 'data_path')
PORT=$(bashio::config 'port')
SECRET_KEY=$(bashio::config 'secret_key')

export DATA_PATH="${DATA_PATH:-/share/manoirquest}"
export PORT="${PORT:-3000}"
export SECRET_KEY="${SECRET_KEY:-change-me-please}"
export DB_PATH="${DATA_PATH}/manoirquest.db"
export NODE_ENV="production"

# ── Ensure data directory exists ─────────────────────────────────────────
mkdir -p "${DATA_PATH}"
bashio::log.info "ManoirQuest data directory: ${DATA_PATH}"
bashio::log.info "Database: ${DB_PATH}"

# ── Run migrations & seed if first start ─────────────────────────────────
cd /app
node scripts/migrate.js
bashio::log.info "Database ready"

# ── Start server ─────────────────────────────────────────────────────────
bashio::log.info "Starting ManoirQuest on port ${PORT}..."
exec node build/index.js
