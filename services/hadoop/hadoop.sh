#!/bin/bash
sudo chown -R app /app/data/hadoop
if ! test -d /app/data/hadoop/dfs/name
then mkdir -p /app/data/hadoop/dfs/data
     /app/hadoop/bin/hdfs namenode -format
fi
echo "*** Starting SSHD"
sudo /etc/init.d/ssh start
echo "*** Starting DFS"
/app/hadoop/sbin/start-dfs.sh 
echo "*** Starting YARN"
/app/hadoop/sbin/start-yarn.sh
echo "*** Starting HistoryServer"
/app/hadoop/sbin/mr-jobhistory-daemon.sh start historyserver
