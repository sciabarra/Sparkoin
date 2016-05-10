#!/bin/bash
opt="$1"
shift
case $opt in
cql) bash enter.sh cassandra "cd /app/apps/cassandra ; /app/cassandra/bin/cqlsh $*" ;;
inv) bash enter.sh cassandra "cd /app/apps/cassandra ; inv $*" ;;
migrate) bash enter.sh cassandra "cd /app/apps/cassandra ; bash migrate.sh $*" ;;
*) echo "usage: $0 {cql <args>|inv <args>|migrate}" ;;
esac

 

