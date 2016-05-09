#!/bin/bash
machine=${1:?container}
command=${2:-/bin/bash}
shift 2
id=$(docker ps | grep _$machine | awk '{print $1}' | head -1)
if test -z "$id" 
then echo Cannot find $machine 
else docker exec -ti $id /bin/bash -c "$command" 
fi
