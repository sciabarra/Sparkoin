#!/bin/bash
sudo chown -R app /app/data/hadoop
if ! test -d /app/data/hadoop/name
then /app/hadoop/bin/hdfs namenode -format
fi
echo "*** Starting SSHD"
sudo /etc/init.d/ssh start
echo "*** Starting DFS"
/app/hadoop/sbin/start-dfs.sh 
# not needed for now
#echo "*** Starting YARN"
#/app/hadoop/sbin/start-yarn.sh
#echo "*** Starting HistoryServer"
#/app/hadoop/sbin/mr-jobhistory-daemon.sh start historyserver
