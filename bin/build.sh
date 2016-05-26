#!/bin/bash
if ! docker volume ls | grep bitcore
then echo "You need to run configure first" ; exit
fi
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE=$(dirname $HERE)
set -x 
sbt assembly
docker-compose -p sparkoin -f $HERE/docker-compose.yml kill
docker-compose -p sparkoin -f $HERE/docker-compose.yml -f rm --all
if test -z "$1"
then BUILD="bitcore java spark cassandra jupyter redis"
else 
	BUILD="$@"
fi
bash -x $BASE/services/build.sh $BUILD
