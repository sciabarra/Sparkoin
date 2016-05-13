FROM sparkoin/bitcore-base:5
ENV BITCOIN_NETWORK=livenet
RUN echo "app ALL=(ALL) NOPASSWD: ALL" >>/etc/sudoers ; sed -i 's/requiretty/!requiretty/' /etc/sudoers
COPY uid.txt /etc/uid.txt
RUN groupadd -g $(cat /etc/uid.txt) app && useradd -g $(cat /etc/uid.txt) -u $(cat /etc/uid.txt) -d /app app -m -s /bin/bash ; mkdir -p /app/bitcore/data ; chown -Rv app:app /app
WORKDIR /app
COPY package.json wait4cassandra.js /app/
RUN npm install 
COPY bitcore.sh control.sh  /app/
RUN dos2unix /app/*.sh ; chmod +x /app/*.sh ; chown -Rf app /app 
EXPOSE 5858
EXPOSE 3001
USER app
CMD bash bitcore.sh
VOLUME [ "/app/bitcore/data" ]
