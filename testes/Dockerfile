FROM node:18

RUN apt-get update && apt-get install -y \
    xvfb \
    libnss3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libgtk-3-0 \
    libgbm1 \
    libasound2 \
    libxcomposite1 \
    libxrandr2 \
    libxcursor1 \
    libxdamage1 \
    libxi6 \
    libxtst6 \
    libpango1.0-0 \
    fonts-liberation \
    libappindicator3-1 \
    libxss1 \
    lsb-release \
    wget \
    xdg-utils \
    python3 \
    make \
    g++ \
    chromium-browser

RUN npm install -g node-gyp

RUN mkdir -p /SME-NovoSGP-TestesAutomatizados

WORKDIR /SME-NovoSGP-TestesAutomatizados

COPY package*.json /SME-NovoSGP-TestesAutomatizados/
RUN npm install

COPY . /SME-NovoSGP-TestesAutomatizados

RUN chmod -R 777 /SME-NovoSGP-TestesAutomatizados

ENV BASE_URL=https://hom-novosgp.sme.prefeitura.sp.gov.br
ENV CYPRESS_VIDEO=false

CMD ["xvfb-run", "--server-args=-screen 0 1600x1050x24", "npx", "cypress", "run", "--browser=chrome"]