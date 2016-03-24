#!/bin/bash
docker build -t sparkoin/java:1 java
docker build -t sparkoin/spark:1 spark
docker build -t sparkoin/kafka:1 kafka
docker build -t sparkoin/cassandra:1 cassandra
docker build -t sparkoin/zeppelin:1 zeppelin
