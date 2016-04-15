#!/bin/bash
sudo chown -Rvf app /app/bitcore /app/data/bitcore
sleep 5
while true
do node /app/apps/bitcore/server.js | tee server.log
done
