FROM sparkoin/bitcore-base:4
ENV BITCOIN_NETWORK=livenet
RUN echo "app ALL=(ALL) NOPASSWD: ALL" >>/etc/sudoers ; sed -i 's/requiretty/!requiretty/' /etc/sudoers
RUN useradd -d /app -m app ; mkdir -p /app/bitcore/data
WORKDIR /app
COPY package.json /app/
RUN npm install 
COPY bitcore.sh control.sh  /app/
RUN dos2unix /app/*.sh ; chmod +x /app/*.sh ; chown -Rf app /app 
EXPOSE 5858
EXPOSE 3001
USER app
CMD bash bitcore.sh
VOLUME [ "/app/bitcore/data" ]
