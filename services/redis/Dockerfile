FROM sparkoin/redis-base:4
COPY uid.txt /etc/
RUN adduser -u $(cat /etc/uid.txt) -h /app app -s /bin/bash -D ;\
    mkdir -p /app/data/redis ; chown -Rv app:app /app ;\
    echo "app ALL=(ALL) NOPASSWD: ALL" >>/etc/sudoers ;\
    sed -i 's/requiretty/!requiretty/' /etc/sudoers
VOLUME /app/data/redis
WORKDIR /app
USER app
CMD redis-server --port 6379 --dir /app/data/redis  --protected-mode no
