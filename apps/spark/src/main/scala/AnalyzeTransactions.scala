import DataModel._
import com.datastax.spark.connector._
import org.apache.spark.streaming.{Milliseconds, StreamingContext}
import org.apache.spark.{SparkConf, SparkContext}
import org.json4s.FieldSerializer._
import org.json4s._
import org.json4s.jackson.Serialization


/**
  * Created by jelerak on 25/03/16.
  */
object AnalyzeTransactions extends App {

  val conf = new SparkConf(true).set("spark.cassandra.connection.host", "192.168.99.99").set("spark.cassandra.connection.port", "9042").setMaster("local").setAppName("SparkToCassandra")
  val sc = new SparkContext(conf)

  val rdd = sc.cassandraTable[Block]("sparkoin", "block")

  rdd.foreach(println(_))

}


