if which docker-machine >/dev/null
then docker-machine start sparkoin
     eval $(docker-machine env sparkoin)
     docker-compose kill
     yes | docker-compose rm
fi
cd services
if test -z "$1"
then 
  sh download.sh
  sh build.sh 
else
  sh build-one.sh "$1"
fi
