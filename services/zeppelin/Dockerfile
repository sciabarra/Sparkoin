FROM sparkoin/java:1
ADD zeppelin-*-bin-all.tgz .
COPY zeppelin.sh /app/
RUN mv zeppelin-* zeppelin 
COPY guava-*.jar /app/zeppelin/interpreter/cassandra
COPY interpreter.json /app/zeppelin/conf
RUN chown -Rvf app:app /app ; chmod -R 0755 /app ; unix2dos -u /app/*.sh
USER app
