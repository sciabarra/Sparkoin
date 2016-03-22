#!/bin/bash
tail -f $(/app/spark/sbin/start-master.sh | awk '{ print $5 }')

