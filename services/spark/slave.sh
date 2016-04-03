#!/bin/bash
source /etc/profile.d/java.sh
tail -f $(/app/spark/sbin/start-slave.sh spark://spark-master.loc:7077  | awk '{ print $5 }')

