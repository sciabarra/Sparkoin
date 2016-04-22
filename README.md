#  Sparkoin

Spark-based Bitcoin Blockchain Analyzer, aka BigData for BitCoin.

[![Gitter](https://badges.gitter.im/sciabarra/Sparkoin.svg)](https://gitter.im/sciabarra/Sparkoin?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

[![Stories in Ready](https://badge.waffle.io/sciabarra/Sparkoin.png?label=ready&title=Ready)](http://waffle.io/sciabarra/Sparkoin)

## Authors

[![Michele Sciabarra](https://raw.githubusercontent.com/sciabarra/Sparkoin/master/msciab.jpg)](http://www.linkedin.com/in/msciab "Michele Sciabarra")

[![Alessandro Mongelli](https://raw.githubusercontent.com/sciabarra/Sparkoin/master/ale.jpg)](http://www.linkedin.com/in/alessandromongelli "Alessandro Mongelli")

## Status

Work in progress - not yet usable.

If you are developing please also check  [development documentatin](DEVEL.md).

## Prerequisites

Tested under 
- OSX 10.10  with Docker Toolbox 1.10.3
- Windows 10 with Docker Toolbox 1.10.3
- CoreOS with Docker 1.9.1

First, on Windows and Mac, Install Docker Toolbox.

On windows you have also to download wget for win32 and place it in the PATH.

Open the docker bash prompt and use the bash shell (also on windows).

You also need: a JDK 1.8, and SBT, all available in the path.
Node 4.2 (or Node Version Manager)  

### Installation of the services

First, configure. You have to tell the ip where your want docker to answer.

If you use docker toolbox, you can use any ip in the range 192.168.99.2 - 192.168.99.99

Otherwise in a live docker installation you have to use the "real" IP.

You can also optionally specify the size of the virtual box image you are going to create. If you want to import the whole Blockchain and store it in Cassandra you need at least 200 GB.

Example:

```
sh configure 192.168.99.99 2000000
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

- jupyter with toree in port 80
- spark in port 7077 with the UI in port 8180
- cassandra in port 9042 and 9160
- kafka in port 9092 with zookeper in port 2818
- bitcore sending transactions to kafka

### Execute Apps

- `control-bitcore.sh {start|stop|restart|kill|debug}` controls bitcore.

`run-cql.sh <args>` execute cql

in particular:

`run-cql.sh -f  sparkcoin.cql` will create the schema in cassandra

`run-jobs.sh <job>` execute a  spark job inside the container

More about this to be added.
