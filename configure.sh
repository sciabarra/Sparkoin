IP=${1:?please specifiy your docker IP in rannge 192.168.99.X with X\<100 and X\>1}
echo $IP >services/java/ip.txt
if which docker-machine
then 
     docker-machine create --driver virtualbox --virtualbox-memory 4096 sparkoin
     docker-machine start sparkoin
     docker-machine ssh sparkoin "echo ifconfig eth1:0 $IP | sudo tee /var/lib/boot2docker/bootlocal.sh"
     docker-machine stop sparkoin ; docker-machine start sparkoin
fi
echo You can now build your enviroment.
