#!/bin/bash
case $1 in

stop)    touch /tmp/server.off ;;
restart) touch /tmp/server.restart ;;
start)   touch /tmp/server.restart     
         rm -f /tmp/server.off /tmp/server.debug 2>/dev/null ;;
kill)    kill -9 $(cat /app/server.pid) ;;
debug) 
       touch /tmp/server.debug
       touch /tmp/server.restart
       rm /tmp/server.off 2>/dev/null
;;
*) echo "usage: {stop|start|restart|debug}" ;;
esac
