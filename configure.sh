IP=${1:?please specifiy your docker IP in rannge 192.168.99.X with X\<100 and X\>1}
#SIZE=${2:?please specify your image size, for the whole blockcahin you need 200000}
SIZE=${2:-20000}
echo $IP >services/java/ip.txt
if which docker-machine
then 
     docker-machine create --driver virtualbox --virtualbox-memory 4096 --virtualbox-disk-size $SIZE sparkoin 
     docker-machine start sparkoin
     docker-machine ssh sparkoin "echo ifconfig eth1:0 $IP | sudo tee /var/lib/boot2docker/bootlocal.sh"
     docker-machine stop sparkoin ; docker-machine start sparkoin
     echo 1000 >services/java/uid.txt
else
     echo $(id -u) >services/java/uid.txt
fi
cp services/java/uid.txt services/jupyter/uid.txt
echo You can now build your enviroment.
