if test "$1" == "off"
then touch /tmp/server.off
elif test "$1" == "on"
then rm -f /tmp/server.off 2>/dev/null
     rm -f /tmp/server.debug 2>/dev/null
elif test "$1" == "debug"
then touch /tmp/server.debug
fi
kill -9 $(cat server.pid)
