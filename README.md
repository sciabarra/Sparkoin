[![Stories in Ready](https://badge.waffle.io/sciabarra/Sparkoin.png?label=ready&title=Ready)](https://waffle.io/sciabarra/Sparkoin)
[![Stories in Ready](https://badge.waffle.io/sciabarra/Sparkoin.png?label=ready&title=Ready)](https://waffle.io/sciabarra/Sparkoin)
#  Sparkoin

Spark-based Bitcoin Blockchain Analyzer, aka BigData for BitCoin.

[![Gitter](https://badges.gitter.im/sciabarra/Sparkoin.svg)](https://gitter.im/sciabarra/Sparkoin?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

NOTE: work in progress - use at your own risk

No guarantee (yet) it does anything useful, works or even compile.

If you are developing please also check  README-DEVEL.md

### Prerequisites

Tested under OSX 10.10 and Windows 7/10 with Docker Toolbox 1.10.3

Install Docker Toolbox.

On windows you have also to download wget for win32 and place it in the PATH.

Open the docker bash prompt and use the bash shell (also on windows).

You also need: a JDK 1.8, Node 4.2 (or Node Version Manager)  and SBT, all available in the path.

### Installation of the services

First, configure. You have to tell the ip where your want docker to answer. 

If you use docker toolbox, you can use any ip in the range 192.168.99.2 - 192.168.99.99

Otherwise in a live docker installation you have to use the "real" IP.

Example:

```
sh configure 192.168.99.99
```

Then

```
sh build.sh
```

It will download all the required software and create the docker images.

Then execute:

```
sh start-services.sh -d
```

It will start in background (omit -d if you want a foreground start):

- zeppelin in port 80
- spark in port 7077 with the UI in port 8180
- cassandra in port 9042 and 9160 
- kafka in port 9092 with zookeper in port 2818
- bitcore sending transactions to kafka
- mongodb on port 27017

### Execute Apps

`start-frontend.sh` will start a frontend app, currently a sample application using mongodb

`start-jobs.sh` execute the spark jobs, currently a sample spark application showing what it is received in kafka

