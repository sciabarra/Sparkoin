#!/bin/bash
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE=$(dirname $HERE)
set -x 
docker-compose -p sparkoin -f $HERE/docker-compose.yml kill
docker-compose -p sparkoin -f $HERE/docker-compose.yml -f rm --all
if test -z "$1"
then BUILD="bitcore java spark cassandra jupyter redis"
else 
	BUILD="$@"
fi
bash -x $BASE/services/build.sh $BUILD
