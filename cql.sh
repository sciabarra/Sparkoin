#!/bin/bash
cd $(dirname $0)/shared
bash ../enter.sh sparkoin_cassandra0 "cd /app/shared ; /app/cassandra/bin/cqlsh $*"

