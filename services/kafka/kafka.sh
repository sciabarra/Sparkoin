#!/bin/bash
source /etc/profile.d/java.sh
kafka/bin/kafka-server-start.sh kafka/config/server.properties
