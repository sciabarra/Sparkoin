#!/bin/bash
cd $(dirname $0)
BASE=$(dirname $PWD)
export ATOM_HOME=$BASE/project/atom
cd $BASE
bin/sbt.sh ensimeConfig
atom .
