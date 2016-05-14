#!/bin/bash
V=5
# end config
cd $(dirname $0)
BASE=$(pwd)
if test -n "$1"
then BUILD="$@"
else echo "Usage: $0 <images...>"
fi
for i in $BUILD
do 
   cd $BASE
   docker build -t sparkoin/$i-base:$V $i/base
   docker build -t sparkoin/$i:$V $i
   cd ..
   if test -d apps/$i 
   then rm services/$i/apps.tar
	git archive -o services/$i/apps.tar --format tar HEAD apps/$i 
   fi
done
