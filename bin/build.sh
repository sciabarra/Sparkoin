#!/bin/bash
if ! docker volume ls | grep bitcore >/dev/null
then echo "You need to run configure first" ; exit
fi
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE=$(dirname $HERE)
set -x
docker-compose -p sparkoin -f $HERE/docker-compose.yml kill
docker-compose -p sparkoin -f $HERE/docker-compose.yml rm -f --all
if test -z "$1"
then $HERE/sbt.sh assembly
     BUILD="bitcore java spark cassandra jupyter"
else BUILD="$@"
fi
bash -x $BASE/services/build.sh $BUILD
