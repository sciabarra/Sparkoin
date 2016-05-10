#!/usr/bin/env bash
if test -z "$1" 
then echo "Please specify your docker IP"
exit 1
else IP="$1"
fi
MYID=$(id -u)
echo $MYID >services/java/uid.txt
echo $IP >services/java/ip.txt
test -e services/ssh/id_rsa ||  ssh-keygen -t rsa -f services/ssh/id_rsa -N ''
cp services/java/uid.txt services/jupyter/uid.txt
cp services/java/uid.txt services/redis/uid.txt
docker volume create --name redis
docker volume create --name cassandra
docker volume create --name bitcore
echo You can now build your enviroment running build.sh
