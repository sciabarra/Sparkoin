set -x 
docker-compose kill
yes | docker-compose rm
cd services
if test -z "$1"
then BUILD="java ssh bitcore cassandra jupyter redis"
else BUILD="$@"
fi
sh build.sh $BUILD
