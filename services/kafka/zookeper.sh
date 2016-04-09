#!/bin/bash
source /etc/profile.d/java.sh
rm -Rvf /tmp/zookeeper
kafka/bin/zookeeper-server-start.sh kafka/config/zookeeper.properties
