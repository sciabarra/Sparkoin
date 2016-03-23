FROM sparkoin/java:1
RUN apk add python
#ADD apache-cassandra-3.4-bin.tar.gz .
ADD apache-cassandra-2.2.5-bin.tar.gz .
ADD cassandra.sh .
RUN mv apache-cassandra-* cassandra ; chown -Rvf app:app /app ; chmod +x /app/cassandra.sh
USER app
EXPOSE 9042
EXPOSE 9160
EXPOSE 7000
EXPOSE 7001
EXPOSE 7199
CMD /app/cassandra.sh
