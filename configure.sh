#!/usr/bin/env bash
if ! which docker-compose 2>&1 >/dev/null
then echo "You need to install docker-compose" ; exit 1
fi
if test -z "$1" 
then echo "Please specify your docker IP"
exit 1
else IP="$1"
fi
MYID=$(id -u)
if test "$MYID" == "0"
then 
echo "Sorry, I refuse to configure this kit as root user."
echo "Note you may need docker 1.11 to run as non-root on certain systems."
exit 1
fi
echo $MYID >services/java/uid.txt
echo $IP >services/java/ip.txt
test -e services/ssh/id_rsa ||  ssh-keygen -t rsa -f services/ssh/id_rsa -N ''
cp services/java/uid.txt services/jupyter/uid.txt
cp services/java/uid.txt services/redis/uid.txt
cp services/java/uid.txt services/bitcore/uid.txt
docker volume create --name redis
docker volume create --name cassandra
docker volume create --name bitcore
echo You can now build your enviroment running build.sh
