#!/bin/bash
LOGS=false
DEVEL=false
while getopts hld opt; do case $opt in 
   h) echo "usage: start.sh [-h] [-d] [-l]" ; exit 0 ;;
   l) LOGS=true ;;
   d) DEVEL=true ;;
esac ; done
if $DEVEL
then docker-compose --no-color -f docker-compose.yml -f docker-compose-devel.yml -d
else docker-compose --no-color -f docker-compose.yml -d up
fi
if $LOGS 
then ./logs.sh
fi
