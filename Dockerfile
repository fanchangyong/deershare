FROM node:10

WORKDIR /tmp

RUN sed -i 's/deb.debian.org/mirrors.163.com/g' /etc/apt/sources.list \
    # && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    # && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y --no-install-recommends apt-utils \
    && apt-get install -y \
      wget gnupg fonts-noto-cjk libxss1 \
      fonts-liberation libasound2 libatk-bridge2.0-0 libatspi2.0-0 libdrm2 \
      libgbm1 libgtk-3-0 libnspr4 libnss3 libx11-xcb1 libxkbcommon0 xdg-utils  \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

RUN wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
RUN apt-get install ./google-chrome-stable_current_amd64.deb

WORKDIR /app

COPY server/package.json ./
COPY server/yarn.lock ./

RUN yarn

COPY ./server ./
COPY ./client/build/*.js ./public/static/js/
COPY ./client/build/*.css ./public/static/css/

ENTRYPOINT ["node", "src/index.js"]
