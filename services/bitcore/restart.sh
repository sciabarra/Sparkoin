#!/bin/bash
if test "$1" == "off"
then touch /tmp/server.off
elif test "$1" == "on"
then rm -f /tmp/server.off 2>/dev/null
     rm -f /tmp/server.debug 2>/dev/null
elif test "$1" == "debug"
then touch /tmp/server.debug
     rm /tmp/server.off 2>/dev/null
fi
if test -e server.pid
then kill $(cat server.pid) ; rm server.pid
fi
