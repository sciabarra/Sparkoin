FROM sparkoin/java:1
ADD zeppelin-0.5.6-incubating-bin-all.tgz .
COPY zeppelin.sh .
RUN mv zeppelin-* zeppelin ; echo "export MASTER=spark://spark-master.loc:7077" >/app/zeppelin/conf/zeppelin-env.sh ; chown -Rvf app:app /app
USER app
CMD /bin/bash

