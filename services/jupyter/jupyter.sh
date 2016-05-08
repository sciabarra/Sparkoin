#!/bin/bash
export JAVA_HOME=/usr/java/jdk1.8.0_65
export SPARK_OPTS="$SPARK_OPTS $TOREE_OPTS"
jupyter notebook --ip=$(hostname -i) --no-browser
