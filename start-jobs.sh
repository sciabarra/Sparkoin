job=${1:?jobname}
cd apps/spark
sbt "runMain $job"
