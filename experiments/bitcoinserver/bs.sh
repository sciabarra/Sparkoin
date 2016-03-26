#!/bin/bash
cd /var/blockchain
if ! test -d /var/blockchain/blockchain
then /usr/sbin/bs --initchain 
fi
/usr/sbin/bs /etc/bs.cfg
