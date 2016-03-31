#!/bin/bash
sleep 5
while true
do node server.js | tee /tmp/server.log
done
