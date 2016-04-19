#!/bin/bash
sudo chown -Rvf app /app/bitcore /app/data/bitcore
socat TCP-LISTEN:5800,fork TCP:127.0.0.1:5858
while true 
do sleep 10  
  if test -e /tmp/server.off
  then echo "Bitcore Off - checking again in 10 seconds"
  else if test -e /tmp/server.debug
       then node --debug /app/apps/bitcore/server.js | tee server.log
       else node /app/apps/bitcore/server.js | tee server.log
       fi
  fi
done
