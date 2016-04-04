#!/bin/bash
sudo chown -Rvf app /app/bitcore
sleep 5
while true
do node /app/apps/etc/node/server.js | tee server.log
done
