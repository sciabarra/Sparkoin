IP=$(hostname -i)
UID=$(uid -u)
if which docker-machine 2>/dev/null
then 
     UID=1000
     if test -z "$1" 
     then echo "Please specify your docker IP, in range 192.168.99.X with X\<100 and X\>1" ; exit 1
     else IP="$1"
     fi
     if test -z "$2"
     then echo "Please specify your image size, for the whole blockchain you need at least 200000" ; exit 1
     else SIZE=$2
     fi
     docker-machine create --driver virtualbox --virtualbox-memory 4096 --virtualbox-disk-size $SIZE sparkoin 
     docker-machine start sparkoin
     docker-machine ssh sparkoin "echo ifconfig eth1:0 $IP | sudo tee /var/lib/boot2docker/bootlocal.sh"
     docker-machine stop sparkoin ; docker-machine start sparkoin
fi
echo $UID >services/java/uid.txt
echo $IP >services/java/ip.txt
cp services/java/uid.txt services/jupyter/uid.txt
echo You can now build your enviroment.
