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
if test -n "$1"
then EXTRA="--no-deps" 
else EXTRA=""
fi	
if $DEVEL
then CMD="docker-compose -p $PROJECT -f $HERE/docker-compose.yml -f $HERE/docker-compose-devel.yml up  -d --no-color $EXTRA"
else CMD="docker-compose -p $PROJECT -f $HERE/docker-compose.yml up -d --no-color $EXTRA"
fi
$CMD "$@"
if $LOGS 
then bash $HERE/logs.sh "$@"
fi
