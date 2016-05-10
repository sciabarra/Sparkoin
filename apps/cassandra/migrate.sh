#!/bin/bash
source /etc/profile
cd $(dirname $0)
inv trireme.cassandra.create
inv trireme.cassandra.migrate

