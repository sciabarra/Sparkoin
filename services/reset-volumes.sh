#!/bin/bash
read -p "Resetting all data from volumes - Are you sure? " -n 1 -r
echo
if test $REPLY == "y"
then
docker-compose kill 
yes | docker-compose rm --all
docker volume rm bitcore hadoop redis #cassandra kafka 
fi
docker volume create --name hadoop
docker volume create --name bitcore 
docker volume create --name redis
#docker volume create --name cassandra 
#docker volume create --name kafka
