# Sparkoin

This is sparkoin, an engine to analyze the Blockchain with Spark

Current status of the project is very early development. Nothing usable yet.

## Install

So far, it is all tested only on OSX with Docker Toolbox 

### Prerequisites

Before starting you need Docker and Docker Compose.

The current scripts system assume there is only one docker virtual machine at a FIXED ip (by default 192.168.99.100). Unfortunately Zookeeper requires this ip.

If you have VirtualBox with more than one VM, you may need to shut all the others down, stop VirtualBox and restart the only one you are using to be sure it is at the standard IP. 

### Build the docker backend

Execute the init script

sh builds.sh [IP]

It will download all the required software and create the docker images.

Then execute:

docker-compose up

It will start:

- kafka in port 9092 with zookeper in port 2818
- spark in port 7077 with the UI in port 8081
- zeppelin in port 8080
- cassandra in port 9042 and 9160


