cat $(dirname $0)/build.sh | grep ${1:?which build} | bash
