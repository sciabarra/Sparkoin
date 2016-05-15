package sparkoin

object Sparkoin {

  import org.json4s._, jackson.JsonMethods._
  import Model._

  def prettify(jstr: String): String = pretty(render(parse(jstr)))

  def extract(jstr: String): FullBlock = parse(jstr).extract[FullBlock]

}
