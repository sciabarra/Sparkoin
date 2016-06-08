#!/bin/bash
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
container=${1:?container}
command=${2:-/bin/bash}
shift 2
id=$(docker ps | grep _"$container" | awk '{print $1}' | head -1)
if test -z "$id" 
then echo Cannot find $container
else docker exec -ti $id /bin/bash -c "$command" 
fi
