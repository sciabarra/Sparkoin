#!/bin/bash
cd spark ; wget -nc http://www-us.apache.org/dist/spark/spark-1.6.1/spark-1.6.1-bin-hadoop2.6.tgz ; cd -
cd cassandra  
wget -nc http://www-eu.apache.org/dist/cassandra/2.2.5/apache-cassandra-2.2.5-bin.tar.gz 
wget -nc http://it.apache.contactlab.it/tomcat/tomcat-8/v8.0.33/bin/apache-tomcat-8.0.33.tar.gz
wget -nc -OROOT.war http://downloads.sourceforge.net/project/helenos-gui/helenos-1.5.war?r=http%3A%2F%2Fsourceforge.net%2Fprojects%2Fhelenos-gui%2Ffiles%2F&ts=1446755866&use_mirror=superb-dca2 
cd -
cd kafka ; wget -nc http://www-eu.apache.org/dist/kafka/0.9.0.1/kafka_2.11-0.9.0.1.tgz ; cd -
cd zeppelin ; wget -nc http://www-eu.apache.org/dist/incubator/zeppelin/0.5.6-incubating/zeppelin-0.5.6-incubating-bin-all.tgz ; cd -
cd zeppelin ; wget -nc http://central.maven.org/maven2/com/google/guava/guava/14.0.1/guava-14.0.1.jar ; cd -
