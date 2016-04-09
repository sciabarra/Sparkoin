if which docker-machine >/dev/null
then docker-machine start sparkoin
     eval $(docker-machine env sparkoin)
fi
docker-compose kill && yes | docker-compose rm
cd services
sh 1-download.sh
sh 2-build.sh 
