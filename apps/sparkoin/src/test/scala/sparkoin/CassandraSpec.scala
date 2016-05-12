package sparkoin

import org.apache.spark.{SparkContext, SparkConf}
import org.scalatest.{Matchers, FunSpec}
import com.datastax.spark.connector._

/**
  * Created by msciab on 11/05/16.
  */
class CassandraSpec extends FunSpec with Matchers {
  val conf = new SparkConf()
    .set("spark.cassandra.connection.host", "127.0.0.1")
    .set("spark.cassandra.connection.port", "9042")

  //.setMaster("local")
  //.setAppName("Hello")
  lazy val sc = new SparkContext("local[2]", "test", conf)

  describe("cassandra") {
    it("connects") {
      val r = sc.cassandraTable("sparkoin", "blockchain")
      println(r.first)
    }

    it("displays one row") {
      pending
    }
  }

}
