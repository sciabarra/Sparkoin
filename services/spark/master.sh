#!/bin/bash
source /etc/profile.d/java.sh
tail -f $(/app/spark/sbin/start-master.sh | awk '{ print $5 }')

