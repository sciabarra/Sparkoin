#!/bin/bash
OLD=$(pwd)
V=5
if test -n "$1"
then BUILD="$@"
else echo "Usage: $0 <images...>"
fi
for i in $BUILD
do 
   cd $(dirname $0)
   docker build -t sparkoin/$i-base:$V $i/base
   docker build -t sparkoin/$i:$V $i
   cd ..
   if test -d apps/$i 
   then git archive -o services/$i/apps.tar --format tar HEAD apps/$i 
   fi
done
cd $OLD
