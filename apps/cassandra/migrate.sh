#!/bin/bash
cd $(dirname $0)
source /etc/profile
if ! [ -z ${CASSANDRA_MASTER+x} ]
then inv trireme.cassandra.create
     inv trireme.cassandra.migrate
fi

