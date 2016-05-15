package sparkoin

import org.apache.spark.{SparkContext, SparkConf}
import org.scalatest.{Ignore, Matchers, FunSpec}
import com.datastax.spark.connector._
import sparkoin._, Sparkoin._

/**
  * Created by msciab on 11/05/16.
  */
@Ignore
class CassandraSpec extends FunSpec with Matchers {
  val conf = new SparkConf()
    .set("spark.cassandra.connection.host", "cassandra.loc")
    .set("spark.cassandra.connection.port", "9042")

  //.setMaster("local")
  //.setAppName("Hello")
  lazy val sc = new SparkContext("local[2]", "test", conf)

  describe("cassandra") {
    it("connects") {
      val r = sc.cassandraTable("sparkoin", "blockchain")
      println(r.first)
    }

  }

}
