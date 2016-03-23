docker-compose kill && docker-compose rm
IP=${2:-192.168.99.100}
cd backend/services
sh 1-download.sh
sh 2-build.sh $IP
