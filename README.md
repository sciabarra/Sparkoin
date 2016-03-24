# Sparkoin v0.1

A docker enviroment with Spark, Cassandra, Kafka under Docker.

## Install

Tested under

- OSX 10.10 with Docker Toolbox 1.10.3
- Windows 7 with Docker Toolbox 1.8.1
- Linux Centos with Docker 1.8

### Prerequisites

On windows you have also to download wget for win32 and place it in the PATH.

The current scripts system assume docker is available a FIXED ip (by default 192.168.99.99). 

Unfortunately Zookeeper requires this ip.

Under Linux, your Docker is normally available at the fixed ip of your machine.

If you are using Docker Toolbox, you need to create a virtual machine and assign him a fixed ip with this procedure:

First, start the docker-toolbox command prompt and type:

```
docker-machine create --driver virtualbox --virtualbox-memory 4096 sparkoin
docker-machine start sparkoin
docker-machine ssh sparkoin
sudo -i
echo "ifconfig eth1:0 192.168.99.99" >/var/lib/boot2docker/bootlocal.sh
```

Now press control-d twice and type:

```
docker-machine stop sparkoin
docker-machine start sparkoin
```

Finally, check the virtual machine answers at ping with 192.168.99.99.

### Build the docker backend

If you are using docker-toolbox, you need to start with

```
eval $(docker-machine env sparkoin)
```

Execute the init script (replace IP with the IP of your docker machine, or 192.168.99.99 if you assigned one to your docker toolbox machine)

sh builds.sh IP 

It will download all the required software and create the docker images.

Then execute:

```
docker-compose up
```
It will start:

- kafka in port 9092 with zookeper in port 2818
- spark in port 7077 with the UI in port 8081
- zeppelin in port 8080
- cassandra in port 9042 and 9160

