# Multi-stage production container for SkillConnect Pakistan Next.js standalone server
FROM node:22-bookworm-slim AS base
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends openssl curl && rm -rf /var/lib/apt/lists/*

FROM base AS builder
WORKDIR /app
COPY . .
# If standalone build does not exist, build it
RUN if [ ! -f "apps/frontend/.next/standalone/apps/frontend/server.js" ]; then \
      npx prisma generate --schema=apps/backend/prisma/schema.prisma && \
      NODE_ENV=production npm run build --workspace=apps/frontend && \
      mkdir -p apps/frontend/.next/standalone/apps/frontend/.next apps/frontend/.next/standalone/apps/frontend/public && \
      cp -a apps/frontend/.next/static apps/frontend/.next/standalone/apps/frontend/.next/ 2>/dev/null || true && \
      cp -a apps/frontend/public/. apps/frontend/.next/standalone/apps/frontend/public/ 2>/dev/null || true ; \
    fi

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Copy root configs & entrypoints
COPY --from=builder /app/package.json ./
COPY --from=builder /app/apps/frontend/package.json ./apps/frontend/
COPY --from=builder /app/apps/backend/package.json ./apps/backend/
COPY --from=builder /app/Procfile ./Procfile
COPY --from=builder /app/server.js ./server.js

# Copy standalone outputs:
# 1. Preserving the exact monorepo path: apps/frontend/.next/standalone/apps/frontend/server.js
COPY --from=builder /app/apps/frontend/.next/standalone/ ./apps/frontend/.next/standalone/
# 2. Also mirror directly to /app/apps/frontend/server.js
COPY --from=builder /app/apps/frontend/.next/standalone/apps/frontend/ ./apps/frontend/
COPY --from=builder /app/apps/frontend/.next/standalone/node_modules/ ./node_modules/

# Copy static assets and public assets into all expected standalone locations
COPY --from=builder /app/apps/frontend/.next/static/ ./apps/frontend/.next/standalone/apps/frontend/.next/static/
COPY --from=builder /app/apps/frontend/.next/static/ ./apps/frontend/.next/static/
COPY --from=builder /app/apps/frontend/public/ ./apps/frontend/.next/standalone/apps/frontend/public/
COPY --from=builder /app/apps/frontend/public/ ./apps/frontend/public/

EXPOSE 3000

# Cloud Run execution entrypoint pointing to the verified standalone server
CMD ["node", "apps/frontend/.next/standalone/apps/frontend/server.js"]
