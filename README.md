#  Sparkoin

Apache Spark-based Bitcoin blockchain analyzer.

NOTE: work in progress - use at your own risk

No guarantee it does anything useful, works or even compile.

### Prerequisites

Tested under OSX 10.10 and Windows 7 with Docker Toolbox 1.10.3

Install Docker Toolbox.

On windows you have also to download wget for win32 and place it in the PATH.

Open the docker bash prompt and use the bash shell (also on windows).

You also need: a JDK, NVM and SBT, all available in the path.

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
sh start.sh -d
```

It will start in background (omit -d if you want a foreground start):

- zeppelin in port 80
- spark in port 7077 with the UI in port 8180
- cassandra in port 9042 and 9160 
- helenos in port 8080, user admin pass admin.
- kafka in port 9092 with zookeper in port 2818
- sparknotebook in port 9000

Note: CQL queries do not work - use zeppelin

### Execute the tests

Execute test-producer.sh to produce transaction from bitcoin to kafka.

Execute test-consumer.sh to consume transactions with Spark.
