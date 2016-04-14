if "$1" == "all"
then docker images  | grep sparkoin | awk '{ print $3 }' | xargs docker rmi
fi
docker volume rm kafka cassandra bitcore
sh $(dirname $0)/cleanup.sh
