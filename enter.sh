#!/bin/bash
machine=${1:?container}
command=${2:-/bin/bash}
shift 2
if which docker-machine >/dev/null
then eval $(docker-machine env sparkoin)
fi
id=$(docker ps | grep $machine | awk '{print $1}' | head -1)
if test -z "$id" 
then echo Cannot find $machine ; exit 1 
fi
docker exec -ti $id /bin/bash -c "$command" 
