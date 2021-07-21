# source https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile
# Install dependencies only when needed
FROM node:alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat \
                       libtool autoconf automake build-base python3 #stuff for sodium-native
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Rebuild the source code only when needed
FROM node:alpine AS builder
WORKDIR /app
COPY . .
#geoip is added during yarn postinstall, which would not be in node_modules by default
COPY --from=deps /app/db/geoip ./db/geoip
COPY --from=deps /app/node_modules ./node_modules
RUN yarn prisma generate && yarn build && yarn install --production --ignore-scripts --prefer-offline

# Production image, copy all the files and run next
FROM node:alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# You only need to copy next.config.js if you are NOT using the default configuration
# COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/.blitz ./.blitz
COPY --from=builder --chown=nextjs:nodejs /app/blitz.config.ts .
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
# for migrations
COPY --from=builder /app/db ./db
#use prod environment (prisma doesn't support .env hierarchy)
COPY --from=builder /app/.env.production ./.env
#need session key for prod
RUN echo SESSION_SECRET_KEY=$(tr -dc A-Za-z0-9 < /dev/urandom | head -c 32 ; echo '') >> .env

USER nextjs

EXPOSE 3000

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry.
# ENV NEXT_TELEMETRY_DISABLED 1

CMD ["sh", "-c", "sleep 5 && yarn prisma migrate deploy && yarn start"]
