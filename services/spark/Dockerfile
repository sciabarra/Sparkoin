FROM sparkoin/java:2
ADD spark-*.tgz .
COPY master.sh slave.sh /app/
RUN mv spark-* spark  ; chown -Rvf app:app /app ; chmod -R 0755 /app ; dos2unix /app/*.sh
USER app
EXPOSE 8080
EXPOSE 7077
CMD /bin/bash
