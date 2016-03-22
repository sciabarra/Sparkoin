#!/bin/bash
#set -x
#if test -n "$1"
#then cat $0 | grep "sparkoin/$1" | bash ; exit 0
#fi
DOCKER_IP=${1:?docker ip FIXED}
echo $DOCKER_IP >kafka/ip.txt
docker build -t sparkoin/java:1 java
docker build -t sparkoin/spark:1 spark
docker build -t sparkoin/zeppelin:1 zeppelin
docker build -t sparkoin/kafka:1 kafka
docker build -t sparkoin/cassandra:1 cassandra
