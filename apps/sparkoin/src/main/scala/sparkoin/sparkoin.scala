package sparkoin

import org.json4s.jackson.JsonMethods._

object Sparkoin {
  def prettify(jstr: String) { pretty(render(parse(jstr))) }

  def prettify(tag: String, jstr: String) { s"<${tag}>${prettify(jstr)}</${tag}>" }
}
