#!/bin/bash
source /etc/java/profile.d/java.sh
jupyter notebook --ip=$(hostname -i) --no-browser
