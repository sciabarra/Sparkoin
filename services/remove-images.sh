read -p "Removing all sparkoin image - Are you sure? " -n 1 -r
if [[ $REPLY =~ ^[Yy]$ ]]
then
docker-compose kill
yes | docker-compose rm
docker images  | grep sparkoin | awk '{ print $3 }' | xargs docker rmi -f
sh $(dirname $0)/cleanup.sh
fi
