FROM nodesource/jessie:4.2.6
ENV BITCOIN_NETWORK=livenet
ENV KAFKA_CONNECT=zookeeper.loc
RUN apt-get update && apt-get install dos2unix
RUN useradd -d /app -m app
WORKDIR /app
COPY package.json bitcore.sh restart.sh  /app/
RUN npm install 
RUN chown -R /app app ; dos2unix /app/*.sh
USER app
CMD bash bitcore.sh
