FROM node:22.17.0-slim

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN corepack enable && corepack prepare pnpm@10.12.3 --activate
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "start"]
