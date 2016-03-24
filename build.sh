docker-compose kill && docker-compose rm
IP=${1:-192.168.99.99}
cd backend/services
sh 1-download.sh
sh 2-build.sh $IP
