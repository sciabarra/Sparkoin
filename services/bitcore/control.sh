#!/bin/bash
case $1 in

stop)    touch /app/data/bitcore/server.off ;;
restart) touch /app/data/bitcore/server.restart ;;
start)   touch /app/data/bitcore/server.restart     
         rm -f /app/data/bitcore/server.off /app/data/bitcore/server.debug 2>/dev/null ;;
kill)    kill -9 $(cat /app/server.pid) ;;
debug) 
       touch /app/data/bitcore/server.debug
       touch /app/data/bitcore/server.restart
       rm /app/data/bitcore/server.off 2>/dev/null
;;
*) echo "usage: {stop|start|restart|debug}" ;;
esac
