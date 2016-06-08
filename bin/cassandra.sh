#!/bin/bash
opt="$1"
shift
case $opt in
cql) bash `dirname $0`/enter.sh cassandra-master "cd /app/apps/cassandra ; /app/cassandra/bin/cqlsh $*" ;;
nodetool) bash `dirname $0`/enter.sh cassandra-master "cd /app/apps/cassandra ; JAVA_HOME=/usr/java/jdk /app/cassandra/bin/nodetool $*" ;;
inv) bash `dirname $0`/enter.sh cassandra-master "cd /app/apps/cassandra ; inv $*" ;;
migrate) bash `dirname $0`/enter.sh cassandra-master "cd /app/apps/cassandra ; bash migrate.sh $*" ;;
*) echo "usage: $0 {cql <args>|nodetool <args>|inv <args>|migrate}" ;;
esac

 

