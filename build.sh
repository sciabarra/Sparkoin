set -x 
docker-compose kill
yes | docker-compose rm --all
if test -z "$1"
then BUILD="java ssh bitcore cassandra spark jupyter"
else BUILD="$@"
fi
bash -x services/build.sh $BUILD
