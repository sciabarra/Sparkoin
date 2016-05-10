#!/bin/bash
source /etc/profile
mkdir /app/cassandra/logs
touch /app/cassandra/logs/system.log
sed -i -e "s/start_rpc: false/start_rpc: true/" /app/cassandra/conf/cassandra.yaml
sed -i -e "s/localhost/$(hostname -f)/" /app/cassandra/conf/cassandra.yaml
sed -i -e "s/127.0.0.1/$(hostname -i)/" /app/cassandra/conf/cassandra.yaml
sudo chown -Rvf app /app/data/cassandra
/app/cassandra/bin/cassandra >/dev/null
while ! nc -z cassandra 9042
do sleep 1
done
cd /app/apps/cassandra
bash migrate.sh
tail -f /app/cassandra/logs/system.log
