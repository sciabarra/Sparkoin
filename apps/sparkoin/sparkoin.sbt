scalaVersion := "2.10.5"

autoScalaLibrary := false

// NOTE! if you change there update also jupyter/build.sbt for preloading
libraryDependencies ++= Seq(
    "org.scala-lang" % "scala-library" % "2.10.5" % "provided"
  , "org.scala-lang" % "scala-reflect" % "2.10.5" % "provided"
  , "org.apache.spark" %% "spark-core" % "1.6.1" % "provided"
  , "org.apache.spark" %% "spark-streaming" % "1.6.1" % "provided"
  , "org.apache.spark" %% "spark-sql" % "1.6.1" % "provided"
  , "com.google.guava" %  "guava"     % "16.0.1"
  , ("org.json4s" %% "json4s-jackson" % "3.2.10")
    .exclude("org.scala-lang", "scala-library")
    .exclude("org.scala-lang", "scalap")
  , ("com.datastax.spark" %% "spark-cassandra-connector" % "1.6.0-M2")
    .exclude("com.google.guava", "guava")
    .exclude("org.scala-lang", "scala-reflect")
)

assemblyOutputPath in assembly := baseDirectory.value.getParentFile / "jupyter" / "sparkoin.jar"

assemblyMergeStrategy in assembly := {
  case PathList("META-INF", "io.netty.versions.properties") => MergeStrategy.first
  case x =>
    val oldStrategy = (assemblyMergeStrategy in assembly).value
    oldStrategy(x)
}
