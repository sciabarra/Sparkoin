#!/bin/bash
export JAVA_HOME=/usr/java/jdk
export PATH="$JAVA_HOME/bin:$PATH"
mkdir /app/cassandra/logs
touch /app/cassandra/logs/system.log
sed -i -e "s/start_rpc: false/start_rpc: true/" /app/cassandra/conf/cassandra.yaml
sed -i -e "s/listen_address: localhost/listen_address: $(hostname -i)/" /app/cassandra/conf/cassandra.yaml
sed -i -e "s/rpc_address: localhost/rpc_address: $(hostname -i)/" /app/cassandra/conf/cassandra.yaml
sed -i -e 's/seeds: "127.0.0.1"/seeds: "cassandra.loc"/' /app/cassandra/conf/cassandra.yaml
DIR=$(hostname -f)
sudo chown  app /app/data 
mkdir -p "/app/data/$DIR/data" "/app/data/$DIR/commit_log" "/app/data/$DIR/saved_caches"
printf "\ndata_file_directories: [ \"/app/data/$DIR/data\" ]\ncommitlog_directory: /app/data/$DIR/commitlog\nsaved_caches_directory: /app/data/$DIR/saved_caches\nhints_directory: /app/data/$DIR/hints\n" >>/app/cassandra/conf/cassandra.yaml 
#sed -i -e "s/^#MAX_HEAP_SIZE=.*/MAX_HEAP_SIZE=1G/" /app/cassandra/conf/cassandra-env.sh
#sed -i -e "s/^#HEAP_NEWSIZE=.*/HEAP_NEWSIZE=100M/" /app/cassandra/conf/cassandra-env.sh
/app/cassandra/bin/cassandra >/dev/null
while ! nc -z $(hostname -i)  9160
do echo wait local cassandra ; sleep 5
done
if [ -z ${CASSANDRA_MASTER+x} ]
then echo "no migration from here"
else 
  while [ "$(/app/cassandra/bin/nodetool status | grep ^UN | wc -l)" -lt "2" ]
  do echo wait for 2 nodes up ; sleep 5
  done
  cd /app/apps/cassandra
  bash migrate.sh
fi
exec tail -f /app/cassandra/logs/system.log
