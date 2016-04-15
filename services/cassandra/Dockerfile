FROM sparkoin/java:2
ADD apache-cassandra-*-bin.tar.gz .
ADD cassandra.sh .
RUN mv apache-cassandra-* cassandra ; mkdir -p /app/data/cassandra/data /app/data/cassandra/commit_log /app/data/cassandra/saved_caches ; chown -Rvf app:app /app ; chmod +x /app/cassandra.sh ; chmod -R 0755 /app ; dos2unix /app/*.sh ; 
RUN echo -n "\ndata_file_directories: [ "/app/data/cassandra/data" ]\ncommitlog_directory: /app/data/cassandra/commitlog\nsaved_caches_directory: /app/data/cassandra/saved_caches\n" >>/app/cassandra/conf/cassandra.yaml
VOLUME [ "/app/cassandra/data" ]
USER app
EXPOSE 9042
EXPOSE 9160
EXPOSE 7000
EXPOSE 7001
EXPOSE 7199
CMD /app/cassandra.sh
