# ── Stage 1: Install production dependencies ─────────────────────────────────
FROM node:24-alpine AS deps

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production

# ── Stage 2: Build the application ───────────────────────────────────────────
FROM node:24-alpine AS builder

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npx prisma generate
RUN npm run build

# ── Stage 3: Production runner ───────────────────────────────────────────────
FROM node:24-alpine AS runner

LABEL org.opencontainers.image.title="Voyagr"
LABEL org.opencontainers.image.description="Multi-tenant travel CMS"
LABEL org.opencontainers.image.source="https://github.com/your-org/voyagr"

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy standalone server output
COPY --from=builder /app/.next/standalone ./
# Copy static assets
COPY --from=builder /app/.next/static ./.next/static
# Copy public assets
COPY --from=builder /app/public ./public
# Copy Prisma schema (needed for migrations at runtime)
COPY --from=builder /app/prisma ./prisma
# Copy generated Prisma client
COPY --from=builder /app/src/generated ./src/generated

# Create uploads directory with correct ownership
RUN mkdir -p ./public/uploads && chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
