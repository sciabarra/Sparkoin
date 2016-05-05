package sparkoin

import org.json4s._
import org.json4s.jackson.JsonMethods._

import org.scalatest.{Matchers, FunSpec}

/**
  * Created by msciab on 05/05/16.
  */
class SparkoinSpec extends FunSpec with Matchers {
  describe("json4s") {
    it("prettify") {
      val json = """{ "a": 1, "b": 2}"""
      val r1 = parse(json)
      val r2 = render(r1)
      val r3 = pretty(r2)

      r3 shouldBe Sparkoin.prettify(json)

      r3 shouldBe
        """{
          |  "a" : 1,
          |  "b" : 2
          |}
        """.stripMargin.trim

      print(Sparkoin.prettify(json))

    }
  }

}
