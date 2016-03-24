FROM sparkoin/java:1
ADD spark-*.tgz .
COPY master.sh slave.sh /app/
RUN mv spark-* spark  ; chown -Rvf app:app /app
USER app
EXPOSE 8080
EXPOSE 7077
CMD /bin/bash
