# v0.1.1

- refactored server to be incremental and download the entire blockchain 
- adding redis to the setup
- separating toolbox scripts from others

# v0.1

* cleanup and bug fixes
* refactored services in order to eliminate download 

# v0.0.18

* fixed hadoop in order to format datanode
* fixed jupyter - can now load assemblies
* added sparkoin library

# v0.0.17

* new importer based on hadoop

# v0.0.16

* updated configurator
* switched to livenet by default
* cql kernel

# v0.0.15

* Debugged and updates the bitcore-control.sh script

# v0.0.14

* blocks and other informations in cassandra
* stoppable and debuggable node

# v0.0.13

* rewritten  jupyter build

# d0.0.12

* #5 volumized data for bitcore, kafka and cassandra
Data for bitcore, kafka and cassandra is in volumes so it is preserved.

* cleanup scripts
There are now scripts in services to reset volumes and drop all the images.

* jupyter external folder
Jupyter by defaults saves notebooks in apps/jupyter

# v0.0.11

- replaced zeppelin with juypter

# v0.0.10

- refactored docker-compose to allow for scaling
- refactored code layout
- fixed issue with windows
- moved node code outside of folder

# v0.0.9

- refactored the build to stop using alpine (does not work with volumes!)
- import transactions in cassandra from livenet
- added the ./cql.sh script to run cqlscript in the shared folder
- addd the ./enter.sh and the shared volume

# v0.0.8

- created this changelog
- changed the sample frontent to http://ochrons.github.io/scalajs-spa-tutorial/
