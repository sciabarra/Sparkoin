#!/bin/bash
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
bash $HERE/enter.sh bitcore "cd /app; ./control.sh $*"

