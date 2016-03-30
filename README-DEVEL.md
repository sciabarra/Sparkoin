# RULE!

- do not break the master....
- *always work in a branch*
  - use <you>-devel for generic devel, o <you>-something-specific
- merge with the master when things are stable

- tag the master when you got a feature working (v0.1.x v0.2 etc)


# TESTS

- test-backend.sh: starts an app,
sending random numbers  on kafka and consumning them with spark

- test-frontend.sh

starts the frontend, a simple akka-http/scalajs app in port 7000
nothing fancy, just checking the akka-http/scalajs loop works


