FROM node:22-bookworm-slim AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
COPY packages/shared/package.json packages/shared/
COPY packages/cli/package.json packages/cli/
COPY apps/web/package.json apps/web/
RUN npm install

FROM deps AS build
COPY packages ./packages
COPY apps ./apps
RUN npm run build -w @openartifacts/shared && npm run build -w @openartifacts/web

FROM node:22-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json* ./
COPY packages/shared/package.json packages/shared/
COPY apps/web/package.json apps/web/
RUN npm install --omit=dev -w @openartifacts/web
COPY --from=build /app/packages/shared/dist packages/shared/dist
COPY --from=build /app/apps/web/.next/standalone ./
COPY --from=build /app/apps/web/.next/static apps/web/.next/static
COPY --from=build /app/apps/web/public apps/web/public
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
CMD ["node", "apps/web/server.js"]
