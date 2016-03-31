FROM nodesource/jessie:4.2.6
RUN useradd -d /app -m app  
WORKDIR /app
USER app
COPY package.json /app/
RUN npm install 
COPY bitcore.sh server.js /app/
ENV BITCOIN_NETWORK=testnet
ENV KAFKA_CONNECT=zookeeper.loc
CMD bash bitcore.sh
