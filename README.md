#  Sparkoin v0.1

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
- CoreOS with Docker 1.10.x

First, on Windows and Mac, Install Docker Toolbox.

On windows you have also to download wget for win32 and place it in the PATH.

Open the docker bash prompt and use the bash shell (also on windows).

You also need: a JDK 1.8, and SBT, all available in the path.

### Installation of the services

First, configure. If you have `docker-machine` (then you are on docker toolbox) you have to tell the ip where your want docker and the size of the virtual disk. 
If you want to import the whole Blockchain and store it in Cassandra you need at least 200 GB.

NOTE! If you use docker toolbox, you can use any ip in the range 192.168.99.2 - 192.168.99.99

Otherwise in a live docker installation you have to use the "real" IP (detected by the configure script)

Example:

```
sh configure 192.168.99.99 2000000
```

# Build

After configuring run

```
sh build.sh
```

It will download all the required software and create the docker images.

Then execute:

```
sh start-services.sh -d
```

It will start in background (omit -d if you want a foreground start):

- jupyter with toree and cql in port 80
- spark in port 7077 with the UI in port 8180
- cassandra in port 9042 and 9160
- kafka in port 9092 with zookeper in port 2818
- bitcore sending transactions to kafka

### Execute Apps

- `control-bitcore.sh {start|stop|restart|kill|debug}` controls bitcore.

`exec-cql.sh <args>` execute cql

in particular:

`run-cql.sh -f  sparkcoin.cql` will create the schema in cassandra

`start-jobs.sh <job>` execute a  spark job inside the container

The important job is: `ImportTransactionsFromOffset`


So:

- initialize with `exec-cql -f sparkoin.cql`
- run `./start-jobs.sh ImportTransactionsFromOffset`

you will end up with the transactions (and the blocks) imported in Cassandra.
