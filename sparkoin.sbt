scalaVersion := "2.10.5"

autoScalaLibrary := false

// NOTE! if you change there update also java/build.sbt for preloading
libraryDependencies ++= Seq(
    "org.scala-lang" % "scala-library" % "2.10.5" % "provided"
  , "org.apache.spark" %% "spark-core" % "1.6.1"  % "provided"
  , "org.apache.spark" %% "spark-sql" % "1.6.1" % "provided" 
  , "org.apache.spark" %% "spark-streaming" % "1.6.1" % "provided"
  , "org.json4s" %% "json4s-jackson" % "3.2.10"
  , "com.datastax.spark" %% "spark-cassandra-connector" % "1.6.0-M2"
  //, "org.apache.spark" %% "spark-streaming-kafka" % "1.6.1" 
  //, "org.apache.kafka" % "kafka-clients" % "0.9.0.1"
)

assemblyOutputPath in assembly := baseDirectory.value / "apps" / "jupyter" / "sparkoin.jar"

assemblyMergeStrategy in assembly := {
  case PathList("META-INF", "io.netty.versions.properties") => MergeStrategy.first
  case x => val oldStrategy = (assemblyMergeStrategy in assembly).value
    oldStrategy(x)
}
