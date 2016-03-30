#!/bin/bash
mkdir /app/cassandra/logs
touch /app/cassandra/logs/system.log
sed -i -e "s/start_rpc: false/start_rpc: true/" /app/cassandra/conf/cassandra.yaml
sed -i -e "s/localhost/$(hostname -f)/" /app/cassandra/conf/cassandra.yaml
sed -i -e "s/127.0.0.1/$(hostname -i)/" /app/cassandra/conf/cassandra.yaml
/app/cassandra/bin/cassandra >/dev/null
/app/tomcat/bin/catalina.sh start
tail -f /app/cassandra/logs/system.log
