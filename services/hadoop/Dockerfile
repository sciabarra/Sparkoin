FROM sparkoin/ssh:1
WORKDIR /app/
ADD hadoop-*.tar.gz .
COPY hadoop.sh /app/
RUN mv hadoop-* hadoop ; echo "export JAVA_HOME=/usr/java/jdk1.8.0_65" >>/app/hadoop/etc/hadoop/hadoop-env.sh  
COPY *.xml /app/hadoop/etc/hadoop/
RUN mkdir -p /app/data/hadoop/dfs/data ; chown -Rvf app:app /app ;  dos2unix /app/*.sh
VOLUME /app/data/hadoop
USER app
#RUN /app/hadoop/bin/hdfs namenode -format
EXPOSE 50010 50020 50070 50075 50090
EXPOSE 19888
EXPOSE 8020 8030 8031 8032 8033 8040 8042 8088
EXPOSE 49707 2122
CMD /app/hadoop.sh ; tail -f /dev/null 
