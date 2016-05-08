#!/bin/bash
tail -f $(JAVA_HOME=/usr/java/jdk1.8.0_65 /app/spark/sbin/start-master.sh | awk '{ print $5 }')

