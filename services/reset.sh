if  test "$1" == "all"
then 
 docker-compose kill
 yes | docker-compose rm
 docker images  | grep sparkoin | awk '{ print $3 }' | xargs docker rmi -f
fi
docker volume rm kafka cassandra bitcore
sh $(dirname $0)/cleanup.sh
