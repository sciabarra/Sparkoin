# VERSION CONTROL RULES

- do not break the master.... *always work in a branch*
- merge with the master when things are stable
- tag the master when you got a feature working (v0.0.x for now)

# DEVEL WITH SCALA

Import the project apps

# DEVEL WITH BITCORE

You can edit the services/bitcore/server.js from the outside of the container.

You can then enter in the container, read the log in /tmp/server.log.

You can restart the server with kill -9 $(cat server.pid)

# TEST

```
test-spark.sh <topic> 
```

Execute a tester app that will read kafka for the tx topic

