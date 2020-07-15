FROM node:13-alpine
WORKDIR /usr/src/app
ARG NODE_ENV=production

RUN apk --no-cache add \
    pango-dev \
    giflib-dev

RUN apk update && apk upgrade && \
    apk --no-cache --virtual build-dependencies add \
    bash \
    g++ \
    make \
    python && \
    rm -rf /var/cache/apk/*

RUN echo @edge http://nl.alpinelinux.org/alpine/v3.8/community >> /etc/apk/repositories && \
    echo @edge http://nl.alpinelinux.org/alpine/v3.8/main >> /etc/apk/repositories && \
    apk add --no-cache \
    chromium \
    nss \
    freetype@edge \
    harfbuzz@edge \
    ttf-freefont@edge && \
    rm -rf /var/cache/apk/* && \
    rm -f /var/log/apache/*

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV CHROME_BIN=/usr/bin/chromium-browser
ENV CHROME_PATH=/usr/lib/chromium/

# Memory limit
ENV NODE_OPTIONS="--max-old-space-size=4096"

COPY package.json ./
COPY yarn.lock ./
COPY ormconfig.js ./
RUN yarn config set no-progress
RUN yarn --production=false
ENV CHROMIUM_PATH=/usr/bin/chromium-browser
COPY . ./
RUN make build
RUN find ./* ! -name dist ! -name Makefile -maxdepth 0 -exec rm -rf {} +
RUN cp -R "./dist/"* . && rm -rf dist
CMD node src/apps/${APP}/main.js
