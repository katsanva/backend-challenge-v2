FROM node:alpine

WORKDIR /build

COPY package.json package-lock.json /build/

COPY src/ /build/src/

COPY public/ /build/

RUN npm ci

FROM node:alpine

EXPOSE 3000

ENV NODE_ENV=production

ENV SERVICEDIR=/app/dist/services

COPY --from=0 /build/dist /app/dist/

COPY config /app/config/

ENTRYPOINT [ "moleculer-runner", "dist/services" ]