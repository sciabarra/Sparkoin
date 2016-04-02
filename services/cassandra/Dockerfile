FROM sparkoin/java:1
ADD apache-cassandra-*-bin.tar.gz .
ADD cassandra.sh .
RUN mv apache-cassandra-* cassandra ; chown -Rvf app:app /app ; chmod +x /app/cassandra.sh ; chmod -R 0755 /app ; unix2dos -u /app/*.sh
USER app
EXPOSE 9042
EXPOSE 9160
EXPOSE 7000
EXPOSE 7001
EXPOSE 7199
CMD /app/cassandra.sh
