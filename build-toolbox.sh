if which docker-machine >/dev/null
then docker-machine start sparkoin
     eval $(docker-machine env sparkoin)
fi
sh build.sh
