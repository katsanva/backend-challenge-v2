FROM node:alpine

WORKDIR /build

COPY package.json package-lock.json tsconfig.json /build/

COPY src/ /build/src/

RUN npm ci && npm run build

FROM node:alpine

WORKDIR /app

ENV NODE_ENV=production

ENV SERVICEDIR=/app/dist/services

COPY --from=0 /build/dist /app/dist/

COPY config /app/config/

COPY package.json package-lock.json /app/

RUN npm i --production

ENTRYPOINT [ "/app/node_modules/.bin/moleculer-runner", "dist/services" ]