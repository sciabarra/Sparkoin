scalaVersion := "2.10.5"

autoScalaLibrary := false

libraryDependencies ++= Seq(
  "org.scala-lang" % "scala-library" % "2.10.5" % "provided"
  , "org.apache.spark" %% "spark-core" % "1.6.1" % "provided"
  , "org.apache.spark" %% "spark-streaming" % "1.6.1" % "provided"
  , "org.apache.spark" %% "spark-sql" % "1.6.0" % "provided"
  , ("org.json4s" %% "json4s-jackson" % "3.2.10")
    .exclude("org.scala-lang", "scala-library")
    //.exclude("org.scala-lang", "scala-compiler")
    //.exclude("org.scala-lang", "scala-reflect")
    .exclude("org.scala-lang", "scalap")
    //, ("com.github.nikita-volkov" % "sext" % "0.2.4")
    // .exclude("org.scala-lang", "scala-reflect")
)

assemblyOutputPath in assembly := baseDirectory.value / "sparkoin.jar"

