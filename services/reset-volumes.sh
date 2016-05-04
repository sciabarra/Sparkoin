read -p "Resetting all data from volumes - Are you sure? " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
docker-compose kill
yes | docker-compose rm
docker volume rm bitcore hadoop #cassandra kafka 
#docker volume create --name cassandra 
#docker volume create --name kafka
docker volume create --name bitcore 
docker volume create --name hadoop
fi
