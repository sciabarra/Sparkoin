#!/bin/bash
cd "$(dirname $0)"
source /etc/profile
if ! [ -z ${CASSANDRA_MASTER+x} ]
then 
    IP=$(hostname -i)
    while ! nc -z $IP 9042
    do sleep 1
    done
     inv trireme.cassandra.create
     inv trireme.cassandra.migrate
fi
