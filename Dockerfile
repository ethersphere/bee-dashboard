FROM node:24-alpine AS build
WORKDIR /src
RUN corepack enable && corepack prepare pnpm@10 --activate
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --ignore-scripts
COPY . .
RUN pnpm run prepare

FROM node:24-alpine AS final
RUN npm install -g serve
WORKDIR /app
COPY --from=build /src/build .
EXPOSE 8080
ENTRYPOINT ["serve", "-l", "8080"]
