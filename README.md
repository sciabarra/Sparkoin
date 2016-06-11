# Sparkoin 0.2

This is the documentation of Sparkoin v0.2

## Prerequisites

Before building you need:

- Docker
- Java Development Kit
- Simple Build Tool

## Build

Dowload the release from [here](http://github.com/sciabarra/Sparkoin) with

```
git clone http://github.com/sciabarra/Sparkoin
cd Sparkoin
bin/configure.sh
bin/build.sh
```

Note that building can take some time because it needs to download large images.

## Run

Once the images are built you can start the cluster and watch the logs with

```
bin/start.sh
```

You can check the logs with

```
bin/logs.sh
```

And stop the cluster with

```
bin/stop.sh
```

Alternatively you can start the cluster and watch the logs with

```
bin/start.sh -l
```

You can safely press control-c without interrupting the cluster.

You can resume the logs with `bin/logs.sh`. You can even see only the logs of one server with `bin/logs.sh {server}`.

Currently {server} is one of `bitcore`, `cassandra` (or `cassandra2` or `cassandra3`) and `jupyter`

## Development features

Here the features available in the support scripts to manage the cluster.

### `start.sh`

You can start the cluster in development mode with `bin/start -d`.
You can show the logs with `-l`. You can just press ^c to stop the logs it wont' kill the services. You can resume logging with `logs.sh` and also specify a service to log.

If you do so, you can change the code in `apps` without having to rebuild the images, since the source is mounted as a volume locally.

You can start only one of the servers with `bin/start.sh {server}`.

Note in such a case you do not have dependencies so you will have to manually start the depending servers. Note that `bitcore` requires at least one `cassandra` host running to write the blockchain in it.

### `stop.sh`

This will stop all the services. `stop.sh -R` will also remove the images.

### `cassandra.sh`

This will control cassandra. You can use `cql`, `nodetool` and `inv` (applying migrations). Without parameter it will shot the parameters.

### `bitcore.sh`

This will control bitcore. You can start, stop or restart it. Without options will show the parameters.

# Change Log

Here is the list of the main changes:

- replaced Hadoop with a 3 node Cassandra cluster
- Bitcore is able to recover from the latest block downloaded
- Jupyter now using Jupyter-Scala kernel for spark
- A new and improved set of scripts for managing the build
- Lots of smaller improvements

## Hadoop replaced by Cassandra

Before starting the project I was warned that Hadoop is not that easy to use.  It is well known it is pretty complicated to manage, and it is even more diffucult in a dockerized environment.

But I was a trusty hearth and I wanted to try it anyway. I was convinced the right place to store the large amout of data from the blockchain was Hadoop. So Sparkoin 0.1 used Hadoop.

However, I tried to download the whole blockchain and I experienced many problems in having all the processes properly setup without losing data, and I also noticed a high load of the machine, both on CPU and disk activity!

I left my server running all the night in order to download the data... and I found a the disk was crashed the morning after! Dead! Unresponsive.

 I am not saying Hadoop crashed my disk but definitely the load on the machine was high. So I decided to buy a new SSD disk.... and to explore if I could use Cassandra also to store the raw data instead of Hadoop.

 The plan was to use Cassandra anyway for storing result of computations, so I only anticated  a planned action.

It turned out the conversion of the code using Hadoop to store in Cassandra instead was quite easy so I settled on Cassandra.

# Improving BitCore reliability

The second problem was with the reliabily of `bitcore`, the downloader of the block chain. Bitcore, a node.js server based on the code BitCore library,  has the bad habit of crashing under high load.

Unfortunately in the first implementation, after a crash it restarted to download the block chain from the beginning! So I had to change the code to be incremental.

Luckily after a crash the database was not lost so the only thing I had to do was checkthe latest block downloaded in Cassandra and continue from there.

I also had problems synchronizing with Cassandra. It takes more time to be ready that Bitcore so a sincronizing script was necessary.

# Notebooks

Another problem was with the notebooks. I tried both Zeppelin and Jupyter Toree. They are both horribly slow, so slow that they appear unusable to me.  SO I replaced them with Jupyter and the (nice) scala jupyter plugin
