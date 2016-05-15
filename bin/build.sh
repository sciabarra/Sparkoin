#!/bin/bash
$BASE=`dirname $0`/..
set -x 
docker-compose kill
docker-compose -f rm --all
if test -z "$1"
then BUILD="bitcore java spark cassandra jupyter"
else BUILD="$@"
fi
bash -x $BASE/services/build.sh $BUILD
