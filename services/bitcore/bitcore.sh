#!/bin/bash
sudo chown -Rf app /app/bitcore /app/data/bitcore
while true 
do node wait4cassandra.js 
  if test -e /app/data/bitcore/server.off
  then echo "Bitcore Off - checking again in 10 seconds"
  else if test -e /tmp/server.debug
       then echo "*** debugging enabled ***"
            socat TCP-LISTEN:5858,fork TCP:127.0.0.1:5800 &
            node --debug=5800 /app/apps/bitcore/server.js | tee server.log
       else node /app/apps/bitcore/server.js | tee server.log
       fi
  fi
  sleep 10
done