#!/usr/bin/env bash
if ! which sbt 2>&1 >/dev/null
then echo "You need to install sbt" ; exit 1
fi
if ! which docker-compose 2>&1 >/dev/null
then echo "You need to install docker-compose" ; exit 1
fi
## suspended - needed for Kafka
#if test -z "$1" 
#then echo "Please specify your docker IP"
#exit 1
#else IP="$1"
#fi
#echo $IP >services/kafka/ip.txt
## suspended - needed for Hadoop
#test -e services/ssh/id_rsa ||  ssh-keygen -t rsa -f services/ssh/id_rsa -N ''
MYID=$(id -u)
if test "$MYID" == "0"
then 
echo "Sorry, I cannot to configure this kit as root user."
echo "You need a non-root user and add him to the docker group to control docker."
echo "Note you need docker 1.11 to run as non-root on RedHat systems."
exit 1
fi
echo $MYID >services/java/uid.txt
cp services/java/uid.txt services/jupyter/uid.txt
cp services/java/uid.txt services/redis/uid.txt
cp services/java/uid.txt services/bitcore/uid.txt
echo "Volumes created:"
docker volume create --name cassandra
docker volume create --name bitcore
echo You can now build your enviroment running build.sh
