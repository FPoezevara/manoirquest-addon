ARG BUILD_FROM=ghcr.io/hassio-addons/base:16.3.2
FROM $BUILD_FROM

# ── System deps ─────────────────────────────────────────────────────────
RUN apk add --no-cache \
    nodejs \
    npm

# ── App ─────────────────────────────────────────────────────────────────
WORKDIR /app

# Copy package files first for layer caching
COPY app/package*.json ./
RUN npm ci --omit=dev

# Copy built app
COPY app/ ./

# Build the SvelteKit app
RUN npm run build

# ── Data directory ───────────────────────────────────────────────────────
# /share/maisonquest will be mounted from HAOS (persistent)
RUN mkdir -p /share/maisonquest

# ── Startup script ───────────────────────────────────────────────────────
COPY run.sh /run.sh
RUN chmod +x /run.sh

EXPOSE 3000

CMD ["/run.sh"]
