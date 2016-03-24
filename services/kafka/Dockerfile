FROM sparkoin/java:1
ADD kafka_*.tgz .
COPY zookeper.sh kafka.sh /app/
RUN mv kafka_* kafka ; chown -Rvf app:app /app
RUN sed -ie 's/zookeeper\.connect=.*/zookeeper.connect=zookeeper.loc:2181/' kafka/config/server.properties
RUN sed -ie "s/#advertised\.host\.name=.*/advertised.host.name=$(cat /etc/ip.txt)/" kafka/config/server.properties
EXPOSE 2181
EXPOSE 9092
USER app
CMD /bin/bash
