if which docker-machine
then 
     docker-machine start sparkoin 
     docker-machine ssh sparkoin "sudo sh /var/lib/boot2docker/bootlocal.sh"
     eval $(docker-machine env sparkoin)
fi
docker-compose up --no-color "$@"
