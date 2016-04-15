#!/bin/bash
docker volume create --name kafka
docker volume create --name cassandra
docker volume create --name bitcore
docker build -t sparkoin/java:2 java
docker build -t sparkoin/spark:2 spark
docker build -t sparkoin/kafka:2 kafka
docker build -t sparkoin/cassandra:2 cassandra
docker build -t sparkoin/bitcore:2 bitcore
docker build -t sparkoin/jupyter:2 jupyter