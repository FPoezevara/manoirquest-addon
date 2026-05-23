ARG BUILD_FROM=ghcr.io/hassio-addons/base:16.3.2

# ── Stage 1 : Build (Node 22 requis pour node:sqlite) ───────────────────
FROM node:22-alpine AS builder
WORKDIR /app
COPY app/package.json ./
RUN npm install
COPY app/ ./
RUN npm run build
RUN npm prune --omit=dev

# ── Stage 2 : Runtime HAOS ───────────────────────────────────────────────
FROM $BUILD_FROM

# Node 22 depuis Alpine 3.21
RUN apk add --no-cache \
    --repository=https://dl-cdn.alpinelinux.org/alpine/v3.21/main \
    nodejs

WORKDIR /app
COPY --from=builder /app/build       ./build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/scripts     ./scripts
COPY --from=builder /app/package.json ./

RUN mkdir -p /share/manoirquest

COPY run.sh /run.sh
RUN chmod +x /run.sh

EXPOSE 3000
CMD ["/run.sh"]
