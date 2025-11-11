FROM node:20-alpine AS base

RUN npm install -g pnpm

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

COPY docker-entrypoint.sh .
RUN chmod +x /usr/src/app/docker-entrypoint.sh

RUN apk add --no-cache mysql-client

RUN pnpm build

EXPOSE 3000

ENTRYPOINT ["/usr/src/app/docker-entrypoint.sh"]

CMD ["pnpm", "start"]