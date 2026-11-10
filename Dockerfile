FROM node:22-bookworm-slim

WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

COPY backend/package.json backend/package-lock.json ./
RUN npm ci

COPY backend/prisma ./prisma
COPY backend/prisma7.config.ts ./
COPY backend/tsconfig.json backend/tsconfig.build.json backend/nest-cli.json ./
COPY backend/src ./src

ENV DATABASE_URL="postgresql://postgres:postgres@postgres:5432/coursework?schema=public"

RUN npx prisma generate && npm run build

COPY backend/docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

ENV NODE_ENV=production
ENV PORT=3031

EXPOSE 3031

ENTRYPOINT ["/app/docker-entrypoint.sh"]
