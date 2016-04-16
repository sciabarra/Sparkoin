import com.datastax.spark.connector._
import kafka.serializer.{DefaultDecoder, StringDecoder}
import org.apache.spark.streaming.kafka.KafkaUtils
import org.apache.spark.streaming.{Milliseconds, StreamingContext}
import org.apache.spark.{SparkConf, SparkContext}
import org.json4s.FieldSerializer._
import org.json4s._
import org.json4s.jackson.Serialization
import org.json4s.jackson.Serialization.read


/**
  * Created by jelerak on 25/03/16.
  */
object ImportTransactions extends App {

  val conf = new SparkConf(true).set("spark.cassandra.connection.host", "192.168.99.99").set("spark.cassandra.connection.port", "9042").setMaster("local").setAppName("SparkToCassandra")
  val sc = new SparkContext(conf)
  val ssc = new StreamingContext(sc, Milliseconds(500))

  case class TxInput(previous_tx_hash: String, output_tx_id: Long, script_sig: String, sequence_no: Long)

  case class TxOutput(value: Long, script_pub_key: String)

  case class Tx(tx_id: String, version_no: Int, tx_in_list: List[TxInput], tx_out_list: List[TxOutput], lock_time: Int)

  implicit val formats = Serialization.formats(ShortTypeHints(List(classOf[TxInput], classOf[TxOutput]))) +
    FieldSerializer[Tx](
      renameTo("tx_id", "hash") orElse renameTo("version_no", "version") orElse renameTo("tx_in_list", "inputs") orElse renameTo("tx_out_list", "outputs") orElse renameTo("lock_time", "nLockTime"),
      renameFrom("hash", "tx_id") orElse renameFrom("version", "version_no") orElse renameFrom("inputs", "tx_in_list") orElse renameFrom("outputs", "tx_out_list") orElse renameFrom("nLockTime", "lock_time")) +
    FieldSerializer[TxInput](
      renameTo("previous_tx_hash", "prevTxId") orElse renameTo("output_tx_id", "outputIndex") orElse renameTo("script_sig", "script") orElse renameTo("sequence_no", "sequenceNumber"),
      renameFrom("prevTxId", "previous_tx_hash") orElse renameFrom("outputIndex", "output_tx_id") orElse renameFrom("script", "script_sig") orElse renameFrom("sequenceNumber", "sequence_no") orElse renameFrom("nlocktime", "lock_time")) +
    FieldSerializer[TxOutput](
      renameTo("value", "satoshis") orElse renameTo("script_pub_key", "script"),
      renameFrom("satoshis", "value") orElse renameFrom("script", "script_pub_key"))


  val kafkaParams = Map[String, String]("metadata.broker.list" -> "192.168.99.99:9092")

  val txTopicsSet = "tx".split(",").toSet
  val blockTopicsSet = "tx".split(",").toSet

  val txMessages = KafkaUtils.createDirectStream[Array[Byte], String, DefaultDecoder, StringDecoder](
    ssc, kafkaParams, txTopicsSet)

  var mapped = txMessages.map { case (key, msg) =>
    //print(msg)
    read[Tx](msg)
  }

  mapped.foreachRDD { rdd =>
    //print(rdd)
    rdd.saveToCassandra("sparkoin", "tx", SomeColumns("tx_id", "version_no", "tx_in_list", "tx_out_list", "lock_time"))
  }

  val blockMessages = KafkaUtils.createDirectStream[Array[Byte], String, DefaultDecoder, StringDecoder](
    ssc, kafkaParams, blockTopicsSet)

  blockMessages.foreachRDD { rdd =>
      rdd.foreach { record => {
        println(record)
      }
    }
  }


  ssc.start()
  ssc.awaitTermination()

  /*
    val collection = sc.parallelize(
      Seq(
        Tx("111111", 1, List(TxInput("aaaaa", 0, "hhh", 1)),List(TxOutput(5000,"pppp")) ,0),
        Tx("222222", 1, List(TxInput("aaaaa", 0, "hhhh", 2)), List(TxOutput(50000,"ppppp")) ,0)))
    collection.saveToCassandra("sparkoin", "tx", SomeColumns("tx_id", "version_no", "tx_in_list", "tx_out_list", "lock_time"))

    val rdd = sc.cassandraTable("sparkoin", "tx")
    println(rdd.count)
    println(rdd.first)
  */
}
