FROM sparkoin/java:4
WORKDIR /app
RUN wget -Ocassandra.tgz http://www-us.apache.org/dist/cassandra/3.5/apache-cassandra-3.5-bin.tar.gz && \
  tar xzvf cassandra.tgz  ; mv apache-cassandra-* cassandra  ; rm cassandra.tgz
