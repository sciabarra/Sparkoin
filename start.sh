#!/bin/bash
LOGS=false
DEVEL=false
while getopts hld opt; do case $opt in 
   h) echo "usage: start.sh [-h] [-d] [-l]" ; exit 0 ;;
   l) LOGS=true ;;
   d) DEVEL=true ;;
esac ; done
if $DEVEL
then docker-compose -f docker-compose.yml -f docker-compose-devel.yml up -d --no-color
else docker-compose -f docker-compose.yml up -d --no-color
fi
if $LOGS 
then ./logs.sh
fi
