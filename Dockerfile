# Build
FROM node:23.10-slim AS build
WORKDIR /app
RUN corepack enable

COPY pnpm-lock.yaml package.json ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

# Prod
FROM node:23.10-slim AS prod
WORKDIR /app
RUN corepack enable

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./
COPY --from=build /app/build ./build
COPY --from=build /app/public ./build/public

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "build/src/app.js"]