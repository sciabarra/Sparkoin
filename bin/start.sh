#!/bin/bash
LOGS=false
DEVEL=false
HERE=`dirname $0`
while getopts hld opt; do case $opt in 
   h) echo "usage: $0 [-h] [-d] [-l] [<services> ...]" ; exit 0 ;;
   l) LOGS=true ;;
   d) DEVEL=true ;;
esac ; done
if $DEVEL
then CMD="docker-compose -f $HERE/docker-compose.yml -f $HERE/docker-compose-devel.yml up -d --no-color"
else CMD="docker-compose -f $HERE/docker-compose.yml up -d --no-color"
fi
$CMD "$@"
if $LOGS 
then bash $HERE/bin/logs.sh
fi
