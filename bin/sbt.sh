#!/bin/bash
cd $(dirname $0)
B=$(dirname $PWD)
cd $B
bash $B/bin/psbt.sh -sbt-jar "$B/sbt-launch.jar" -sbt-boot "$B/project/boot" -ivy "$B/project/ivy2" "$@"
