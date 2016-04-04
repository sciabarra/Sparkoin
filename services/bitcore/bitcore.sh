#!/bin/bash
sleep 5
while true
do node /app/apps/etc/node/server.js | tee server.log
done
