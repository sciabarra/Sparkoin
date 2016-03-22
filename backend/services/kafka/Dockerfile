FROM sparkoin/java:1
ADD kafka_2.11-0.9.0.1.tgz .
COPY zookeper.sh kafka.sh ip.txt /app/
RUN mv kafka_* kafka ; chown -Rvf app:app /app
RUN sed -ie 's/zookeeper\.connect=.*/zookeeper.connect=zookeeper.loc:2181/' kafka/config/server.properties
RUN sed -ie "s/#advertised\.host\.name=.*/advertised.host.name=$(cat ip.txt)/" kafka/config/server.properties
EXPOSE 2181
EXPOSE 9092
USER app
CMD /bin/bash


