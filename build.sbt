import sbt.Keys._

name := "sparkoin"

organization := "com.sciabarra.michele"

val r = project.in(file("."))

val akkaHttpVersion = "2.0.3"

lazy val f = crossProject.in(file("frontend")).
  settings(
    name := "sparkoin-front",
    scalaVersion := "2.11.7",
    libraryDependencies ++= Seq(
      "com.lihaoyi" %%% "upickle" % "0.2.8")
  ).
  jvmSettings(
    scalaVersion := "2.11.7",
    libraryDependencies ++= Seq(
      "com.typesafe.akka" %% "akka-stream-experimental" % akkaHttpVersion
      , "com.typesafe.akka" %% "akka-http-core-experimental" % akkaHttpVersion
      , "com.typesafe.akka" %% "akka-http-experimental" % akkaHttpVersion
      , "com.typesafe.scala-logging" %% "scala-logging" % "3.1.0"
      , "ch.qos.logback" % "logback-classic" % "1.1.3"
      , "org.apache.kafka" % "kafka-clients" % "0.9.0.1"
    ),
    baseDirectory in reStart := baseDirectory.value.getParentFile.getParentFile
  ).
  jsSettings(
    libraryDependencies ++= Seq(
      "org.scala-js" %%% "scalajs-dom" % "0.8.2"
    ),
    persistLauncher in Compile := true,
    jsDependencies ++= Seq(
      ProvidedJS / "bundle.js")
  ).enablePlugins(SbtWeb)

lazy val fJVM = f.jvm

lazy val fJS = f.js

lazy val bundle = project.in(file("frontend") / "bundle")

addCommandAlias("bundle", "bundle/bundle")

addCommandAlias("rs", "; fJVM/assets ; fJVM/reStart")

addCommandAlias("fo", "fJS/fastOptJS")

val s = project.in(file("backend")/"spark")
