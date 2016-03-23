FROM sparkoin/java:1
ADD zeppelin-0.5.6-incubating-bin-all.tgz .
COPY zeppelin.sh /app/
RUN mv zeppelin-* zeppelin 
COPY guava-*.jar /app/zeppelin/interpreter/cassandra
COPY interpreter.json /app/zeppelin/conf
RUN chown -Rvf app:app /app
USER app
