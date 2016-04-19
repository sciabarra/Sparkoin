FROM nodesource/jessie:4.2.6
ENV BITCOIN_NETWORK=livenet
ENV KAFKA_CONNECT=zookeeper.loc
RUN apt-get update && apt-get -y install sudo dos2unix socatvim telnet
RUN echo "app ALL=(ALL) NOPASSWD: ALL" >>/etc/sudoers ; sed -i 's/requiretty/!requiretty/' /etc/sudoers
RUN useradd -d /app -m app ; mkdir -p /app/bitcore/data
WORKDIR /app
COPY package.json /app/
RUN npm install 
COPY bitcore.sh restart.sh  /app/
RUN dos2unix /app/*.sh ; chmod +x /app/*.sh ; chown -Rvf app /app 
EXPOSE 5858
USER app
CMD bash bitcore.sh
VOLUME [ "/app/bitcore/data" ]
