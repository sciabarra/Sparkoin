if which docker-machine
then eval $(docker-machine env sparkoin)
     docker-machine ssh sparkoin "sudo sh /var/lib/boot2docker/bootlocal.sh"
fi
docker-compose up --no-color "$@"
