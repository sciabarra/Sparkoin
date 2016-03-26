name := "Sparkoin-backend"

organization := "com.sciabarra.michele"

scalaVersion := "2.10.5"

libraryDependencies ++= Seq(
    "org.apache.kafka" % "kafka-clients" % "0.8.2.1"
  , "org.apache.spark" %% "spark-core" % "1.6.1"
  , "org.apache.spark" %% "spark-streaming" % "1.6.1"
  , "org.apache.spark" %% "spark-streaming-kafka" % "1.6.1"
  //, "ch.qos.logback" % "logback-classic" % "1.1.6"
)

