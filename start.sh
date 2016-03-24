if which docker-machine
then eval $(docker-machine env sparkoin)
fi
docker-compose up --no-color "$@"
