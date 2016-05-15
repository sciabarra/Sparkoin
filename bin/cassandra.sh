#!/bin/bash
opt="$1"
shift
case $opt in
cql) bash `dirname $0`/enter.sh cassandra "cd /app/apps/cassandra ; /app/cassandra/bin/cqlsh $*" ;;
inv) bash `dirname $0`/enter.sh cassandra "cd /app/apps/cassandra ; inv $*" ;;
migrate) bash `dirname $0`/enter.sh cassandra "cd /app/apps/cassandra ; bash migrate.sh $*" ;;
*) echo "usage: $0 {cql <args>|inv <args>|migrate}" ;;
esac

 

