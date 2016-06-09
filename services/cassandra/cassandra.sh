#!/bin/bash
source /etc/profile
mkdir /app/cassandra/logs
touch /app/cassandra/logs/system.log
sed -i -e "s/start_rpc: false/start_rpc: true/" /app/cassandra/conf/cassandra.yaml
sed -i -e "s/listen_address: localhost/listen_address: $(hostname -i)/" /app/cassandra/conf/cassandra.yaml
sed -i -e "s/rpc_address: localhost/rpc_address: $(hostname -i)/" /app/cassandra/conf/cassandra.yaml
sed -i -e 's/seeds: "127.0.0.1"/seeds: "cassandra.loc"/' /app/cassandra/conf/cassandra.yaml
sed -i -e "s/^#MAX_HEAP_SIZE=.*/MAX_HEAP_SIZE=1G/" /app/cassandra/conf/cassandra-env.sh
sed -i -e "s/^#HEAP_NEWSIZE=.*/HEAP_NEWSIZE=100M/" /app/cassandra/conf/cassandra-env.sh
sudo chown -Rvf app /app/data/cassandra
bash /app/apps/cassandra/migrate.sh &
/app/cassandra/bin/cassandra -f
