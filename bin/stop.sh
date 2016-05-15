#!/bin/bash
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT=sparkoin
KILL=false
REMOVE=false
while getopts hkR opt; do case $opt in 
   h) echo "usage: $0 [-k] [-R] " ; exit 0 ;;
   k) KILL=true  ; shift ;;
   R) REMOVE=true ; shift ;;
esac ; done
if $KILL
then docker-compose -p $PROJECT -f $HERE/docker-compose.yml -f $HERE/docker-compose-devel.yml kill "$@"
else docker-compose -p $PROJECT -f $HERE/docker-compose.yml -f $HERE/docker-compose-devel.yml stop "$@"
fi
if $REMOVE
then docker-compose -p $PROJECT -f $HERE/docker-compose.yml -f $HERE/docker-compse-devel.yml rm --all -f
fi
