FROM sparkoin/spark-base:4
COPY master.sh slave.sh /app/
RUN chown -Rvf app:app /app ; chmod -R 0755 /app ; dos2unix /app/*.sh
USER app
EXPOSE 8080
EXPOSE 7077
CMD /bin/bash
