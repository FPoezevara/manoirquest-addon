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

# ── Notification quotidienne (push add-on → notify.mobile_app_*) ──────────
# Le scheduler vit dans le serveur Node (hooks.server.ts). SUPERVISOR_TOKEN est
# injecté automatiquement par le superviseur (homeassistant_api: true).
NOTIFY_ENABLED=$(bashio::config 'notify_enabled')
NOTIFY_TIME=$(bashio::config 'notify_time')

# notify_targets est une liste YAML → on la replie en CSV pour l'env.
NOTIFY_TARGETS=""
for target in $(bashio::config 'notify_targets'); do
  NOTIFY_TARGETS="${NOTIFY_TARGETS}${NOTIFY_TARGETS:+,}${target}"
done

export NOTIFY_ENABLED="${NOTIFY_ENABLED:-true}"
export NOTIFY_TIME="${NOTIFY_TIME:-08:00}"
export NOTIFY_TARGETS
bashio::log.info "Notif quotidienne: enabled=${NOTIFY_ENABLED} time=${NOTIFY_TIME} targets=${NOTIFY_TARGETS:-<aucune>}"

# ── Ensure data directory exists ─────────────────────────────────────────
mkdir -p "${DATA_PATH}"
bashio::log.info "ManoirQuest data directory: ${DATA_PATH}"
bashio::log.info "Database: ${DB_PATH}"

# ── Run migrations & seed if first start ─────────────────────────────────
cd /app
node --experimental-sqlite scripts/migrate.js
bashio::log.info "Database ready"

# ── Start server ─────────────────────────────────────────────────────────
bashio::log.info "Starting ManoirQuest on port ${PORT}..."
exec node --experimental-sqlite build/index.js
