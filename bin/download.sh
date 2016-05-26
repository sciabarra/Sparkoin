#!/bin/bash
cd "$(dirname "$0")"
cd ../services
for i in */base
do cd $i  
	grep "cat url.txt" Dockerfile | while read a cmd ; do 
          echo $cmd
	  bash -c "$cmd" ; done
   cd -
done
