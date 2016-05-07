FROM sparkoin/java:4
WORKDIR /app
RUN wget -Ospark.tgz http://www-us.apache.org/dist/spark/spark-1.6.1/spark-1.6.1-bin-hadoop2.6.tgz &&\
  tar xzvf spark.tgz  ; mv spark-* spark  ; rm spark.tgz
