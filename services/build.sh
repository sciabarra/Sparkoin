#!/bin/bash
V=5
# end config
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$HERE"
if test -n "$1"
then BUILD="$@"
else echo "Usage: $0 <images...>"
fi
for i in $BUILD
do
   cd $HERE/..
   if test -d apps/$i
   then rm services/$i/apps.tar
	      git archive -o services/$i/apps.tar --format tar HEAD apps/$i
   fi
   cd $HERE
   docker build -t sparkoin/$i-base:$V $i/base
   docker build -t sparkoin/$i:$V $i
done
