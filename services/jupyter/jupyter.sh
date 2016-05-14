#!/bin/bash
export JAVA_HOME=/usr/java/jdk
export PATH=$JAVA_HOME/bin:$PATH
jupyter notebook --ip=$(hostname -i) --no-browser
