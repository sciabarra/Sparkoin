FROM sparkoin/bitcore-base:5
ENV BITCOIN_NETWORK=livenet
COPY uid.txt /etc/uid.txt
RUN groupadd -g $(cat /etc/uid.txt) app && useradd -g $(cat /etc/uid.txt) -u $(cat /etc/uid.txt) -d /app app -m -s /bin/bash ; mkdir -p /app/bitcore/data ; chown -Rv app:app /app
RUN echo "app ALL=(ALL) NOPASSWD: ALL" >>/etc/sudoers ; sed -i 's/requiretty/!requiretty/' /etc/sudoers
WORKDIR /app
COPY wait4cassandra.js bitcore.sh control.sh  /app/
RUN dos2unix /app/*.sh ; chmod +x /app/*.sh ; chown -Rf app /app
EXPOSE 5858
EXPOSE 3001
USER app
COPY apps.tar /app/
RUN tar xvf /app/apps.tar -C /app ; rm /app/apps.tar
CMD bash bitcore.sh
VOLUME [ "/app/bitcore/data" ]
