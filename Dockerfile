# Build static assets. Secrets and production config are injected at container start
# from VPS/EasyPanel env (see docker/50-runtime-env.sh), not from this repository.
FROM node:22-alpine AS build

WORKDIR /app

RUN corepack enable

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

# Serve dist/ on HTTP port 80 (EasyPanel terminates HTTPS at the proxy).
FROM nginx:alpine

RUN apk add --no-cache jq

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY docker/50-runtime-env.sh /docker-entrypoint.d/50-runtime-env.sh
RUN chmod +x /docker-entrypoint.d/50-runtime-env.sh

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
