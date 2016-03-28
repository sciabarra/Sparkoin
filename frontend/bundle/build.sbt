name := "bundle"

scalaVersion := "2.11.7"

lazy val bundle = taskKey[Unit]("bundle")

enablePlugins(SbtWeb)

enablePlugins(SbtJsEngine)

import com.typesafe.sbt.jse.SbtJsTask._
import com.typesafe.sbt.jse.SbtJsEngine.autoImport.JsEngineKeys._
import scala.concurrent.duration._

bundle := {
  ( npmNodeModules in Assets ).value
  val inf = (baseDirectory.value / "start.js").getAbsolutePath
  val res = baseDirectory.value.getParentFile / "js" / "src" / "main" / "resources"
  res.mkdirs
  val outf = (res / "bundle.js").getAbsolutePath
  val modules =  (baseDirectory.value / "node_modules").getAbsolutePath
  println(s"Bundling: ${inf} -> ${outf}")
  executeJs(state.value,
    engineType.value,
    None,
    Seq(modules),
    baseDirectory.value / "browserify.js",
    Seq(inf, outf),
    30.seconds)
  ()
}
