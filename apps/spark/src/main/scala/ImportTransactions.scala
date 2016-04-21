import DataModel._
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

  implicit val formats = Serialization.formats(ShortTypeHints(List(classOf[TxInput], classOf[TxOutput]))) +
    FieldSerializer[Tx](
      renameTo("tx_id", "hash") orElse renameTo("version_no", "version")  orElse renameTo("lock_time", "nLockTime"),
      renameFrom("hash", "tx_id") orElse renameFrom("version", "version_no") orElse renameFrom("nLockTime", "lock_time")) +
/*
    FieldSerializer[TxInput](
      renameTo("previous_tx_hash", "prevTxId") orElse renameTo("output_tx_id", "outputIndex") orElse renameTo("script_sig", "script") orElse renameTo("sequence_no", "sequenceNumber"),
      renameFrom("prevTxId", "previous_tx_hash") orElse renameFrom("outputIndex", "output_tx_id") orElse renameFrom("script", "script_sig") orElse renameFrom("sequenceNumber", "sequence_no") orElse renameFrom("nlocktime", "lock_time")) +
    FieldSerializer[TxOutput](
      renameTo("value", "satoshis") orElse renameTo("script_pub_key", "script"),
      renameFrom("satoshis", "value") orElse renameFrom("script", "script_pub_key")) +
*/
    FieldSerializer[BlockHeader](
      renameTo("prev_hash", "prevHash") orElse renameTo("merkle_root", "merkleRoot"),
      renameFrom("prevHash", "prev_hash") orElse renameFrom("merkleRoot", "merkle_root"))



  val kafkaParams = Map[String, String]("metadata.broker.list" -> "192.168.99.99:9092")

  val txTopicsSet = "tx".split(",").toSet
  val blockTopicsSet = "block".split(",").toSet

  val txMessages = KafkaUtils.createDirectStream[Array[Byte], String, DefaultDecoder, StringDecoder](
    ssc, kafkaParams, txTopicsSet)

  var mapped = txMessages.map { case (key, msg) =>
    //print(msg)
    read[Tx](msg)
  }

  mapped.foreachRDD { rdd =>
    //print(rdd)
    rdd.saveToCassandra("sparkoin", "tx", SomeColumns("tx_id", "block_id", "block_time", "version_no", "tx_in_list", "tx_out_list", "lock_time"))

    val txOutDetail = rdd.map(tx => tx.tx_out_list.filter(out => out.address != "false").map(out => {
      def uuid = java.util.UUID.randomUUID.toString
      new TxOutDetail(uuid, tx.tx_id, out.value, out.address, tx.block_time)
    }))

    txOutDetail.saveToCassandra("sparkoin", "tx_out_detail")
  }

  val blockMessages = KafkaUtils.createDirectStream[Array[Byte], String, DefaultDecoder, StringDecoder](
    ssc, kafkaParams, blockTopicsSet)

  var mappedBlocks = blockMessages.map { case (key, msg) =>
    read[Block](msg)
  }

  mappedBlocks.foreachRDD { rdd =>
    rdd.saveToCassandra("sparkoin", "block", SomeColumns("block_id", "block_height", "tx_number", "difficulty", "header"))

/*
    rdd.foreach { record => {
        println("block header: " + record)
      }
    }
*/
  }


  ssc.start()
  ssc.awaitTermination()

}
