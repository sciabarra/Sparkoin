#!/bin/bash
curl -o $(dirname $0)/sbt-launch.jar https://repo.typesafe.com/typesafe/ivy-releases/org.scala-sbt/sbt-launch/0.13.11/sbt-launch.jar
bash sbt.sh exit  

