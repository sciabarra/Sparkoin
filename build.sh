if which docker-machine >/dev/null
then eval $(docker-machine env sparkoin)
fi
docker-compose kill && docker-compose rm
cd services
sh 1-download.sh
sh 2-build.sh 
