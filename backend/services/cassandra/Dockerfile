FROM sparkoin/java:1
ADD apache-cassandra-3.4-bin.tar.gz .
RUN mv apache-cassandra-* cassandra ; chown -Rvf app:app /app
USER app
CMD /bin/bash

