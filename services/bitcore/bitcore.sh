#!/bin/bash
sudo chown -Rf app /app/bitcore /app/data/bitcore
socat TCP-LISTEN:5858,fork TCP:127.0.0.1:5800 &
NODE_OPTS="--max_old_space_size=8192"
while true 
do node wait4cassandra.js 
  if test -e /app/data/bitcore/server.off
  then echo "Bitcore Off - checking again in 10 seconds"
  else if test -e /tmp/server.debug
       then echo "*** debugging enabled ***"
            NODE_OPTS="$NODE_OPTS --debug=5800"
       fi
       node $NODE_OPTS /app/apps/bitcore/server.js | tee server.log
  fi
  sleep 10
done
