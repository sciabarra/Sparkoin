job=${1:?jobname}
./enter.sh sparkoin_spark "cd /app/apps/spark ; export JAVA_HOME=/usr/java/jdk1.8.0_65 ; export PATH=$JAVA_HOME/bin:$PATH ; sbt -Dsbt.boot.directory=project/boot -Dsbt.ivy.home=project/repo  \"runMain $job\""
