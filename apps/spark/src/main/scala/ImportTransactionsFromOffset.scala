import DataModel._
import com.datastax.spark.connector._
import kafka.common.TopicAndPartition
import kafka.message.MessageAndMetadata
import kafka.serializer.{DefaultDecoder, StringDecoder}
import org.apache.spark.sql.cassandra.CassandraSQLContext
import org.apache.spark.streaming.kafka.{HasOffsetRanges, KafkaUtils}
import org.apache.spark.streaming.{Milliseconds, StreamingContext}
import org.apache.spark.{SparkConf, SparkContext}
import org.json4s.FieldSerializer._
import org.json4s._
import org.json4s.jackson.Serialization
import org.json4s.jackson.Serialization.read


/**
  * Created by jelerak on 25/03/16.
  */
object ImportTransactionsFromOffset extends App {

  val conf = new SparkConf(true).
    set("spark.cassandra.connection.host", sys.props("ip.loc")).
    set("spark.cassandra.connection.port", "9042").
    setMaster("local[2]").
    setAppName("SparkToCassandra")
  val sc = new SparkContext(conf)
  val ssc = new StreamingContext(sc, Milliseconds(500))

  implicit val formats = Serialization.formats(ShortTypeHints(List(classOf[TxInput], classOf[TxOutput]))) +
    FieldSerializer[Tx](
      renameTo("tx_id", "hash") orElse renameTo("version_no", "version")  orElse renameTo("lock_time", "nLockTime"),
      renameFrom("hash", "tx_id") orElse renameFrom("version", "version_no") orElse renameFrom("nLockTime", "lock_time")) +
    FieldSerializer[BlockHeader](
      renameTo("prev_hash", "prevHash") orElse renameTo("merkle_root", "merkleRoot"),
      renameFrom("prevHash", "prev_hash") orElse renameFrom("merkleRoot", "merkle_root"))


  val cc = new CassandraSQLContext(sc)

  val txOffsetMap = cc.sql("SELECT topic, partition, offset from sparkoin.offsets where topic = 'tx'").collect().map( row =>
  TopicAndPartition(row.getAs[String]("topic"), row.getAs[Short]("partition")) -> row.getAs[Long]("offset")).toMap

  val kafkaParams = Map[String, String]("metadata.broker.list" -> "192.168.99.99:9092")

  val txMessageHandler = (mmd: MessageAndMetadata[Array[Byte], String]) => read[Tx](mmd.message)

  val txMessages = KafkaUtils.createDirectStream[Array[Byte], String, DefaultDecoder, StringDecoder, Tx](
    ssc, kafkaParams, txOffsetMap, txMessageHandler)

  txMessages.foreachRDD { rdd =>
    //print(rdd)
    val txOffsetRanges = rdd.asInstanceOf[HasOffsetRanges].offsetRanges

    val txOutDetail = rdd.flatMap(tx => tx.tx_out_list.map(out => {
      def uuid = java.util.UUID.randomUUID.toString
      new TxOutDetail(uuid, tx.tx_id, out.value, out.address, tx.block_time)
    }))

    txOutDetail.saveToCassandra("sparkoin", "tx_out_detail", SomeColumns("id", "tx_id", "amount", "receiver", "when"))

    val blockOffsetRanges = rdd.asInstanceOf[HasOffsetRanges].offsetRanges.map(offsetRange => (offsetRange.topic, offsetRange.partition, offsetRange.untilOffset))

    val tx = rdd.map(tx => tx)
    tx.saveToCassandra("sparkoin", "tx", SomeColumns("tx_id", "block_id", "block_time", "version_no", "tx_in_list", "tx_out_list", "lock_time"))

    sc.parallelize(blockOffsetRanges).saveToCassandra("sparkoin", "offsets", SomeColumns("topic", "partition", "offset"))
  }

  val blockOffsetMap = cc.sql("SELECT topic, partition, offset from sparkoin.offsets where topic = 'block'").collect().map( row =>
    TopicAndPartition(row.getAs[String]("topic"), row.getAs[Short]("partition")) -> row.getAs[Long]("offset")).toMap

  val blocMessageHandler = (mmd: MessageAndMetadata[Array[Byte], String]) => read[Block](mmd.message)

  val blockMessages = KafkaUtils.createDirectStream[Array[Byte], String, DefaultDecoder, StringDecoder, Block](
    ssc, kafkaParams, blockOffsetMap, blocMessageHandler)

  blockMessages.foreachRDD { rdd =>

    val blockOffsetRanges = rdd.asInstanceOf[HasOffsetRanges].offsetRanges.map(offsetRange => (offsetRange.topic, offsetRange.partition, offsetRange.untilOffset))

    rdd.saveToCassandra("sparkoin", "block", SomeColumns("block_id", "block_height", "tx_number", "difficulty", "header"))

    sc.parallelize(blockOffsetRanges).saveToCassandra("sparkoin", "offsets", SomeColumns("topic", "partition", "offset"))
  }

  ssc.start()
  ssc.awaitTermination()

}
