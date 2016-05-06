FROM sparkoin/java:4
WORKDIR /app
RUN wget -Okafka.tgz http://www-eu.apache.org/dist/kafka/0.9.0.1/kafka_2.11-0.9.0.1.tgz &&\
  tar xzvf kafka.tgz  ; mv kafka_* kafka  ; rm kafka.tgz
