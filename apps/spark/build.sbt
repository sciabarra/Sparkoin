name := "Sparkoin-backend"

organization := "com.sciabarra.michele"

scalaVersion := "2.10.5"

libraryDependencies ++= Seq(
    "org.apache.kafka" % "kafka-clients" % "0.8.2.1"
  , "org.apache.spark" %% "spark-core" % "1.6.1"
  , "org.apache.spark" %% "spark-streaming" % "1.6.1"
  , "org.apache.spark" %% "spark-streaming-kafka" % "1.6.1"
  , "org.apache.spark" %% "spark-sql" % "1.6.1"
  , "com.datastax.spark" % "spark-cassandra-connector_2.10" % "1.6.0-M2"
  , "org.apache.cassandra"  % "cassandra-clientutil" % "3.4"
  , "org.apache.cassandra"  % "cassandra-thrift" % "3.4"
  , "org.json4s" %% "json4s-jackson" % "{latestVersion}"
//  , "org.apache.hadoop" % "hadoop-hdfs" % "2.6.0"
//  , "org.apache.hadoop" % "hadoop-client" % "2.2.0"
//  , "org.apache.hadoop" % "hadoop-common" % "2.2.0"
//, "ch.qos.logback" % "logback-classic" % "1.1.6"
)

