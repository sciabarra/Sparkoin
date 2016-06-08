#!/bin/bash
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT=sparkoin
LOGS=false
DEVEL=false
while getopts hld opt; do case $opt in 
   h) echo "usage: $0 [-h] [-d] [-l] [<services> ...]" ; exit 0 ;;
   l) LOGS=true ;;
   d) DEVEL=true ;;
esac ; done
shift "$((OPTIND - 1))"
if $DEVEL
then CMD="docker-compose -p $PROJECT -f $HERE/docker-compose.yml -f $HERE/docker-compose-devel.yml"
else CMD="docker-compose -p $PROJECT -f $HERE/docker-compose.yml"
fi
if test -z "$1"
then $CMD up -d --no-color
     $CMD scale cassandra=3
else $CMD up -d --no-color --no-deps "$@"
fi
if $LOGS 
then bash $HERE/logs.sh "$@"
fi
