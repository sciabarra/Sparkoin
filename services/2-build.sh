#!/bin/bash
docker build -t sparkoin/java:2 java
docker build -t sparkoin/shared:2 shared
docker build -t sparkoin/spark:2 spark
docker build -t sparkoin/kafka:2 kafka
docker build -t sparkoin/cassandra:2 cassandra
docker build -t sparkoin/zeppelin:2 zeppelin
docker build -t sparkoin/bitcore:2 bitcore
