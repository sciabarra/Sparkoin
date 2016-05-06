package sparkoin

import org.json4s._
import org.json4s.jackson.JsonMethods._

object Sparkoin {

  def prettify(jstr: String): String = { pretty(render(parse(jstr))) }

  def prettify(tag: String, jstr: String): String = { s"<${tag}>${prettify(jstr)}</${tag}>" }
}
