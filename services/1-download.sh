#!/bin/bash
cd java
wget -nc -Ojdk-8u65-linux-x64.tar.gz --progress=dot:giga --no-cookies --no-check-certificate --header "Cookie: gpw_e24=http%3A%2F%2Fwww.oracle.com%2F; oraclelicense=accept-securebackup-cookie" http://download.oracle.com/otn-pub/java/jdk/8u65-b17/jdk-8u65-linux-x64.tar.gz
wget -nc -Osbt-launch.jar https://repo.typesafe.com/typesafe/ivy-releases/org.scala-sbt/sbt-launch/0.13.11/sbt-launch.jar
wget -nc -Oamm https://github.com/lihaoyi/Ammonite/releases/download/0.5.7/ammonite-repl-0.5.7-2.10.5
wget -nc -Osbt https://raw.githubusercontent.com/paulp/sbt-extras/master/sbt
cd -
cd spark ; wget -nc http://www-us.apache.org/dist/spark/spark-1.6.0/spark-1.6.0-bin-hadoop2.6.tgz ; cd -
cd cassandra
wget -nc http://www-eu.apache.org/dist/cassandra/2.2.5/apache-cassandra-2.2.5-bin.tar.gz
cd -
cd kafka ; wget -nc http://www-eu.apache.org/dist/kafka/0.9.0.1/kafka_2.11-0.9.0.1.tgz ; cd -
