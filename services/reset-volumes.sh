#!/bin/bash
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE=$(dirname $HERE)
read -p "Resetting all data from volumes - Are you sure? " -n 1 -r
echo
if test $REPLY == "y"
then
docker-compose -p sparkoin -f $BASE/bin/docker-compose.yml kill 
docker-compose -p sparkoin -f $BASE/bin/docker-compose.yml rm -f --all
docker volume rm cassandra cassandra2 cassandra3 cassandra4 cassandra5 # bitcore kafka  hadoop redis
fi
docker volume create --name cassandra
docker volume create --name cassandra2
docker volume create --name cassandra3
docker volume create --name cassandra4
docker volume create --name cassandra5
#docker volume create --name bitcore 
#docker volume create --name redis
#docker volume create --name hadoop
#docker volume create --name kafka
