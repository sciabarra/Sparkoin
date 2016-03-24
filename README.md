# Easy Zeppelin-Spark-Cassandra-Kafka with Docker, v0.2

A docker enviroment with Spark, Cassandra, Kafka under Docker.

## Install

Tested under OSX 10.10 and Windows 7 with Docker Toolbox 1.10.3

### Prerequisites

On windows you have also to download wget for win32 and place it in the PATH.

Unfortunately Zookeeper requires a fixed ip, so we need to deploy the entire systen in a fixed ip.

This is a problem with Docker Toolbox since it usually assigns a new IP.

To avoid this problem, the script ./configure.sh create a virtual machine and give it an alias that is kept.


### Installation

Fist time you use the kit, type 

```
sh configure 192.168.99.99
```

You can use any ip in the range 192.168.99.2 - 192.168.99.99

This will create a virtual machine and will set an IP alias for further installation.

The execute 

```
sh build.sh
```

It will download all the required software and create the docker images.

Then execute:

```
sh start.sh -d
```

It will start in background (omit -d if you want a foreground start):

- zeppelin in port 80
- spark in port 7077 with the UI in port 8081
- cassandra in port 9042 and 9160
- kafka in port 9092 with zookeper in port 2818

Access zeppelin with http://192.168.99.99 and start to play. 

