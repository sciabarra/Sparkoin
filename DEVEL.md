# VERSION CONTROL RULES

- do not break the master.... *always work in a branch*
- merge with the master when things are stable
- tag the master when you got a feature working (v0.0.x for now)

# DEVEL WITH SCALA

Install an IDE (IntelliJ recommended) and SBT

Import the project apps and go coding...

# DEVEL WITH NODE

You do not need to install node.

You can edit the services/bitcore/server.js from the outside of the container.

You can then enter in the container, with the script "docker-enter.sh <service>"

- Read the log with `tail -f /tmp/server.log`.
- Restart the server with `kill -9 $(cat server.pid)`


