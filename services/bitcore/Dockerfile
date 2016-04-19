FROM nodesource/jessie:4.2.6
ENV BITCOIN_NETWORK=livenet
ENV KAFKA_CONNECT=zookeeper.loc
RUN apt-get update && apt-get -y install sudo dos2unix socat
RUN echo "app ALL=(ALL) NOPASSWD: ALL" >>/etc/sudoers ; sed -i 's/requiretty/!requiretty/' /etc/sudoers
RUN useradd -d /app -m app ; mkdir -p /app/bitcore/data
USER app
WORKDIR /app
COPY package.json /app/
RUN npm install 
COPY bitcore.sh restart.sh  /app/
RUN chown -R /app app ; dos2unix /app/*.sh
EXPOSE 5800
CMD bash bitcore.sh
VOLUME [ "/app/bitcore/data" ]
