#!/bin/bash
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE=$(dirname $HERE)
set -x 
docker-compose kill
docker-compose -f rm --all
if test -z "$1"
then BUILD="bitcore java spark cassandra jupyter"
else 
        $HERE/esbt.sh assembly
	BUILD="$@"
fi
bash -x $BASE/services/build.sh $BUILD
