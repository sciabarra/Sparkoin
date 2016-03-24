#!/bin/bash
rm -Rvf /tmp/zookeeper
kafka/bin/zookeeper-server-start.sh kafka/config/zookeeper.properties
