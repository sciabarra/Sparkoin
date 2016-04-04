# VERSION CONTROL RULES

- do not break the master.... *always work in a branch*
- merge with the master when things are stable
- tag the master when you got a feature working (v0.0.x for now)
- update always documentation (README.md, DEVEL.md and the CHANGELOG.md)


# Prerequisites for Devel

In addition to the prerequisites, you also need: a JDK 1.8,  SBT, all available in the path, and an IDE (Intellij preferred)

# DEVEL WITH DOCKER

You can enter in the virtual machines with `./enter.sh <substring>`

example `./enter.sh cass` , `./enter.sh bitcore`

In the vms there is `sbt`, `amm` (scala shell)

The apps folder is accessible under /app/apps

# DEVEL WITH SCALA

In your host machine, install an IDE (IntelliJ recommended) and SBT

Import the project apps and go coding...

- `sbt run` starts play in development mode (edit and you see immediately the result)\

- `sbt jobs/runMain <job>` runs your spark jobs.

# DEVEL WITH NODE

You do not need to install node.

You can edit the apps/etc/node/server.js from the outside of the container.

You can then enter in the container, with the script "enter.sh <service>"

You can restart the server with `./restart.sh`

After restart, it will show the logs on console continuosly.

When you need to chang someting, just ^c, then `up` then `enter`.