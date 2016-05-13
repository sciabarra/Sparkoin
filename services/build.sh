#!/bin/bash
cd $(dirname $0)
V=5
if test -n "$1"
then BUILD="$@"
else echo "Usage: $0 <images...>"
fi
for i in $BUILD
do 
   docker build -t sparkoin/$i-base:$V $i/base
   docker build -t sparkoin/$i:$V $i
done
cd -
