FROM node:20-alpine AS build
WORKDIR /src
RUN corepack enable && corepack prepare pnpm@10 --activate
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

FROM node:20-alpine AS final
RUN corepack enable && corepack prepare pnpm@10 --activate && pnpm add -g serve
WORKDIR /app
COPY --from=build /src/build .
EXPOSE 8080
ENTRYPOINT ["serve", "-l", "8080"]
