#!/bin/bash
cd $(dirname $0)
B=$(dirname $PWD)
cd $B
bash $B/bin/sbt-paulp.sh -sbt-jar "$B/sbt-launch.jar" -sbt-boot "$B/project/boot" -ivy "$B/project/ivy2" "$@"
