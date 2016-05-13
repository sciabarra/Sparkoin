FROM sparkoin/cassandra-base:5
WORKDIR /app
ADD cassandra.sh .
RUN mkdir -p /app/data/cassandra/data /app/data/cassandra/commit_log /app/data/cassandra/saved_caches ; chown -Rvf app:app /app ; chmod +x /app/cassandra.sh ; chmod -R 0755 /app ; dos2unix /app/*.sh ;
RUN echo -n "\ndata_file_directories: [ "/app/data/cassandra/data" ]\ncommitlog_directory: /app/data/cassandra/commitlog\nsaved_caches_directory: /app/data/cassandra/saved_caches\nhints_directory: /app/data/cassandra/hints\n" >>/app/cassandra/conf/cassandra.yaml ;\
 echo "PATH=/app/cassandra/bin:\$PATH" >>/etc/profile
VOLUME [ "/app/cassandra/data" ]
USER app
EXPOSE 9042
EXPOSE 9160
EXPOSE 7000
EXPOSE 7001
EXPOSE 7199
CMD /app/cassandra.sh
