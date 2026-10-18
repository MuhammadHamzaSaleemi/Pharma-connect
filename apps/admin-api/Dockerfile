# Build context: apps/admin-api (uses this app's own package-lock.json).
FROM node:20-alpine AS build
# Prisma's query engine needs OpenSSL on Alpine.
RUN apk add --no-cache openssl
WORKDIR /app
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci --ignore-scripts && npx prisma generate
COPY . .
RUN npx nest build && npm prune --omit=dev

FROM node:20-alpine
RUN apk add --no-cache openssl
WORKDIR /app
ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=5000 \
    UPLOAD_DIR=/app/uploads
COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
RUN mkdir -p uploads && chown node:node uploads
USER node
# Uploaded images must outlive the container: mount a volume here.
VOLUME ["/app/uploads"]
EXPOSE 5000
# Apply pending migrations, then start. Secrets (DATABASE_URL, JWT_*, CORS_ORIGIN) come from the runtime env.
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]
