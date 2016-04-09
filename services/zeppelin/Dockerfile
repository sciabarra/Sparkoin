FROM sparkoin/java:2
ADD zeppelin-*-bin-all.tgz .
COPY zeppelin.sh /app/
RUN mv zeppelin-* zeppelin 
COPY guava-*.jar /app/zeppelin/interpreter/cassandra
COPY interpreter.json /app/zeppelin/conf
RUN chown -Rvf app:app /app ; chmod -R 0755 /app ; dos2unix /app/*.sh
USER app
