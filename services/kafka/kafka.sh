#!/bin/bash
source /etc/profile.d/java.sh
sudo chown -Rvf app /app/data/kafka
kafka/bin/kafka-server-start.sh kafka/config/server.properties
