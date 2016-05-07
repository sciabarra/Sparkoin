FROM sparkoin/ssh:4
WORKDIR /app/
RUN wget -O/app/hadoop.tgz  http://www-us.apache.org/dist/hadoop/common/hadoop-2.6.4/hadoop-2.6.4.tar.gz &&\
 tar xzvf /app/hadoop.tgz -C /app ; mv /app/hadoop-* /app/hadoop ; rm /app/hadoop.tgz
