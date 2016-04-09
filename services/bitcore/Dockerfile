FROM nodesource/jessie:4.2.6
RUN apt-get update && apt-get -y install sudo dos2unix
RUN echo "app ALL=(ALL) NOPASSWD: ALL" >>/etc/sudoers ; sed -i 's/requiretty/!requiretty/' /etc/sudoers
ENV BITCOIN_NETWORK=livenet
ENV KAFKA_CONNECT=zookeeper.loc
RUN apt-get update && apt-get install dos2unix
RUN useradd -d /app -m app ; mkdir -p /app/bitcore/data
WORKDIR /app
COPY package.json bitcore.sh restart.sh  /app/
RUN npm install 
RUN chown -R /app app ; dos2unix /app/*.sh
USER app
CMD bash bitcore.sh
VOLUME [ "/app/bitcore/data" ]
