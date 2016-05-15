# Development

So you want to partecipate to development?

Ok here there are the rules.

# VERSION CONTROL RULES

- do not break the master.... *always work in a branch*
- merge with the master when things are stable
- tag the master when you got a feature working (v0.0.x for now)
- update always documentation (README.md, DEVEL.md and the CHANGELOG.md)

# Prerequisites for Devel

In addition to the prerequisites in README, you also need: 
- a JDK 1.8,  
- SBT
- an IDE (Intellij preferred)

# DOCKER TIPS

You can enter in the virtual machines with `./enter.sh <substring>`

example  `./enter.sh bitcore`

In the containers (except bitcore) there is  `sbt` (build tool) and  `amm` (scala shell)

The apps folder is accessible under /app/apps

## SERVICES SCRIPT

There is now a script to reset volumes if you want to remove all data. It is

./services/reset-volumes.sh

There is also a script to remove all the images (but not the volumes):

./services/remove-images.sh

Both ask for confirmation before destroying data.

You can then enter in the containers with the script "enter.sh <service>"

# SCALA TIPS

In your host machine, install an IDE (IntelliJ recommended) and SBT

Import the project apps and go coding...

- `sbt run` starts play in development mode (edit and you see immediately the result)\

- `sbt jobs/runMain <job>` runs your spark jobs.

# NODE TIPS

You do not need to install node.

You can edit the apps/etc/node/server.js from the outside of the container. After editing you need to restart, as follows.

You can use the bitcore control script to restart it, to put in debug mode or kill if it gets stuck

When enabled, debugger is accessible in port 5858

