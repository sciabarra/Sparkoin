FROM nodesource/jessie:4.2.6
RUN apt-get update &&\
    apt-get -y install sudo dos2unix socat vim telnet
RUN mkdir /app
COPY package.json /app/
WORKDIR /app
RUN npm install
