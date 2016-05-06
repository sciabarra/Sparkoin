FROM sparkoin/kafka-base:4
COPY zookeper.sh kafka.sh /app/
RUN chown -Rvf app:app /app ; chmod -R 0755 /app ; dos2unix  /app/*.sh
RUN sed -ie 's/zookeeper\.connect=.*/zookeeper.connect=zookeeper.loc:2181/' kafka/config/server.properties
RUN sed -ie "s/#advertised\.host\.name=.*/advertised.host.name=$(cat /etc/ip.txt)/" kafka/config/server.properties
RUN sed -ie "s!log\.dirs=/tmp/kafka-logs!log.dirs=/app/data/kafka!" kafka/config/server.properties ; mkdir -p /app/data/kafka ; chown -R app /app/data/kafka
VOLUME [ "/app/data/kafka" ]
EXPOSE 2181
EXPOSE 9092
USER app
CMD /bin/bash
