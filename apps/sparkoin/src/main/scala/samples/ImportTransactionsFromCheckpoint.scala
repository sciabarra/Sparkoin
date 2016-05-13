package samples

import com.datastax.spark.connector._
import org.apache.spark.SparkConf
import org.apache.spark.streaming.{Milliseconds, StreamingContext}
import org.json4s.FieldSerializer._
import org.json4s._
import org.json4s.jackson.Serialization
import org.json4s.jackson.Serialization._
import samples.DataModel._


/**
  * Created by jelerak on 25/03/16.
  */
object ImportTransactionsFromCheckpoint extends App {

  implicit val formats = Serialization.formats(ShortTypeHints(List(classOf[TxInput], classOf[TxOutput]))) +
    FieldSerializer[Tx](
      renameTo("tx_id", "hash") orElse renameTo("version_no", "version")  orElse renameTo("lock_time", "nLockTime"),
      renameFrom("hash", "tx_id") orElse renameFrom("version", "version_no") orElse renameFrom("nLockTime", "lock_time")) +
    FieldSerializer[BlockHeader](
      renameTo("prev_hash", "prevHash") orElse renameTo("merkle_root", "merkleRoot"),
      renameFrom("prevHash", "prev_hash") orElse renameFrom("merkleRoot", "merkle_root"))

  val txTopicsSet = "tx".split(",").toSet
  val blockTopicsSet = "block".split(",").toSet
  val kafkaParams = Map(
    "metadata.broker.list" -> s"${sys.props("ip.loc")}:9092",
    "auto.offset.reset" -> "smallest"
  )

  val checkpointDirectory = "/app/apps/spark/checkpoints"
  val ssc = StreamingContext.getOrCreate(
      checkpointDirectory,
      setupSsc(txTopicsSet, blockTopicsSet, kafkaParams, checkpointDirectory)
  )
  ssc.start()
  ssc.awaitTermination()

  def setupSsc(
    txTopicsSet: Set[String],
    blockTopicsSet: Set[String],
    kafkaParams: Map[String, String],
    checkpointDirectory: String
  )(): StreamingContext = {

    val conf = new SparkConf(true).set("spark.cassandra.connection.host", "192.168.99.99").set("spark.cassandra.connection.port", "9042").setMaster("local[2]").setAppName("SparkToCassandra")
    val ssc = new StreamingContext(conf, Milliseconds(500))

    val txMessages = KafkaUtils.createDirectStream[Array[Byte], String, DefaultDecoder, StringDecoder](
      ssc, kafkaParams, txTopicsSet).checkpoint(Milliseconds(5000))

    txMessages.map{ case (key, msg) =>
      read[Tx](msg)
    }.foreachRDD { rdd =>

      val txOutDetail = rdd.flatMap(tx => tx.tx_out_list.map(out => {
        def uuid = java.util.UUID.randomUUID.toString
        new TxOutDetail(uuid, tx.tx_id, out.value, out.address, tx.block_time)
      }))

      txOutDetail.saveToCassandra("sparkoin", "tx_out_detail", SomeColumns("id", "tx_id", "amount", "receiver", "when"))

      val tx = rdd.map(tx => tx)
      tx.saveToCassandra("sparkoin", "tx", SomeColumns("tx_id", "block_id", "block_time", "version_no", "tx_in_list", "tx_out_list", "lock_time"))
    }

    val blockMessages = KafkaUtils.createDirectStream[Array[Byte], String, DefaultDecoder, StringDecoder](
      ssc, kafkaParams, blockTopicsSet).checkpoint(Milliseconds(5000))

    blockMessages.map { case (key, msg) =>
      read[Block](msg)
    }.foreachRDD { rdd =>
      rdd.saveToCassandra("sparkoin", "block", SomeColumns("block_id", "block_height", "tx_number", "difficulty", "header"))
    }
    ssc.checkpoint(checkpointDirectory)
    ssc
  }

}
