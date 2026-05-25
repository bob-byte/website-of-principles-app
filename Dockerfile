# Build static assets (Vite).
FROM node:22-alpine AS build

WORKDIR /app

RUN corepack enable

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

# Serve dist/ over HTTPS (port 443)
FROM nginx:alpine

RUN apk add --no-cache openssl

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY docker/40-generate-ssl.sh /docker-entrypoint.d/40-generate-ssl.sh
RUN chmod +x /docker-entrypoint.d/40-generate-ssl.sh

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
