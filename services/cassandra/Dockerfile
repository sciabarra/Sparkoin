FROM sparkoin/cassandra-base:5
WORKDIR /app
ADD cassandra.sh .
RUN chown -Rvf app:app /app ; chmod +x /app/cassandra.sh ; chmod -R 0755 /app ; dos2unix /app/*.sh ; echo "PATH=/app/cassandra/bin:\$PATH" >>/etc/profile
USER app
EXPOSE 9042
EXPOSE 9160
EXPOSE 7000
EXPOSE 7001
EXPOSE 7199
COPY apps.tar /app/
RUN tar xvf /app/apps.tar -C /app ; rm /app/apps.tar
CMD /app/cassandra.sh
