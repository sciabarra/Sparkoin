job=${1:?jobname}
cd apps
sbt "jobs/runMain $job"
