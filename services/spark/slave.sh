#!/bin/bash
tail -f $(/app/spark/sbin/start-slave.sh spark://spark-master.loc:7077  | awk '{ print $5 }')

