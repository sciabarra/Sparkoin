#!/bin/bash
HERE=`dirname $0`
docker-compose -f $HERE/docker-compose.yml logs -f "$@" 
