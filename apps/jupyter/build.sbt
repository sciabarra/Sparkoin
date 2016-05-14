scalaVersion := "2.10.5"

libraryDependencies ++= Seq(
  "org.apache.spark" %% "spark-core" % "1.6.1", 
  "org.apache.spark" %% "spark-streaming" % "1.6.1",
  "org.apache.spark" %% "spark-sql" % "1.6.1",
  "com.google.guava" %  "guava"     % "16.0.1",
  "com.datastax.spark" %% "spark-cassandra-connector" % "1.6.0-M2"
)
