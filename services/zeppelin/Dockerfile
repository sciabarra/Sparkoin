FROM sparkoin/zeppelin-base:5
RUN tar xzvf zeppelin-*-bin-all.tgz ; rm *.tgz ;  mv zeppelin-* zeppelin ; mv guava-*.jar /app/zeppelin/interpreter/cassandra
COPY zeppelin.sh /app/
COPY interpreter.json /app/zeppelin/conf
RUN chown -Rvf app:app /app ; chmod -R 0755 /app ; dos2unix /app/*.sh
USER app
CMD bash zeppelin.sh
