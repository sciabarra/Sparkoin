if which docker-machine 2>&1 >/dev/null
then 
     docker-machine start sparkoin 
     docker-machine ssh sparkoin "sudo sh /var/lib/boot2docker/bootlocal.sh"
     eval $(docker-machine env sparkoin)
fi
docker-compose up --no-color -d
if test "$1" == "logs"
then ./logs.sh
fi
