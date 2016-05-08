#  Sparkoin v0.1

Spark-based Bitcoin Blockchain Analyzer, aka BigData for BitCoin.

[![Gitter](https://badges.gitter.im/sciabarra/Sparkoin.svg)](https://gitter.im/sciabarra/Sparkoin?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

[![Stories in Ready](https://badge.waffle.io/sciabarra/Sparkoin.png?label=ready&title=Ready)](http://waffle.io/sciabarra/Sparkoin)

## Authors

[![Michele Sciabarra](https://raw.githubusercontent.com/sciabarra/Sparkoin/master/msciab.jpg)](http://www.linkedin.com/in/msciab "Michele Sciabarra")

[![Alessandro Mongelli](https://raw.githubusercontent.com/sciabarra/Sparkoin/master/ale.jpg)](http://www.linkedin.com/in/alessandromongelli "Alessandro Mongelli")

## Status

Currently it is a development kit.

In the current status
- it limits to downloading only the first 1000 transactions from the blockchain
- there is not yet a cluster - only a single node hadoop is deployed
- you are expected to use jupyter to write your scala based analisys


If you are developing please also check  [development documentatin](DEVEL.md).

## Prerequisites

Tested under :

- OSX 10.10  with Docker for OSX Beta 
- Windows 10 with Docker Toolbox 1.10.3
- Boot2Docker with Docker 1.10.1

First, on Windows and Mac, Install Docker Toolbox.
Or, if you are so lucky to get an invitatation, use docker beta.

Open the docker bash prompt and use the bash shell (also on windows).

More prerequisites for development. Check DEVEL.md

### Installation of the services

First, configure. If you have the toolbox use `./configure-toolbox.sh` otherwise `./configure.sh`

You have to tell the ip of your docker, that is usually the ip of your machine for docker standalone, or 192.168.99.99 for the docker-toolbox.

Docker toolbox wants also to know the size of the virtual disk for your virtual machine.

If you want to import the whole Blockchain and store it in Hadoop you need at least 200 GB.

NOTE! If you use docker toolbox, you can use any ip in the range 192.168.99.2 - 192.168.99.99

Otherwise in a live docker installation you have to use the "real" IP (detected by the configure script)

Example:

```
sh configure-toolbox.sh 192.168.99.99 2000000
```

# Build

After configuring run

```
sh build.sh
```

It will download all the required software and create the docker images.

Then execute:

```
sh start.sh 
```

It will start your images in background.

Bitcore will load all the blockchain transactions in hadoop.

You can then access http://YOUR-IP:8888 to jupyter to perform your analysis.

As a starting point there is a sparkoin.ipynb notebook that will use the beginning of a sparkoin library for analyzing the data.

### Extras

- `control-bitcore.sh {start|stop|restart|kill|debug}` controls bitcore.

- `exec-hfs.sh <args>` execute filesystem commands against hadoop

