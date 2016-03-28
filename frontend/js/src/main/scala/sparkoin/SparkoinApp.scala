package sparkoin

import sparkoin.bundle.Bundle

import scala.scalajs.js

/**
  * Created by msciab on 28/02/16.
  */
object SparkoinApp extends js.JSApp {
  def main(): Unit = {
    println("hello from scalajs")
    import Bundle._
    jquery("#title").text(lodash.camelCase("This is a test"))
    //println(js.Dynamic.global.Bundle)
  }
}