package samples

import org.apache.log4j.{Level, Logger}
import org.apache.spark.{SparkConf, SparkContext}
//import _root_.kafka.serializer.StringDecoder

/**
  * Created by msciab on 25/03/16.
  */
object KafkaRead extends App {

  Logger.getLogger("org").setLevel(Level.OFF)
  Logger.getLogger("akka").setLevel(Level.OFF)

  val conf = new SparkConf().setAppName("Test").setMaster("local")
  val sc = new SparkContext(conf)

  val kafkaParams = Map[String, String]("metadata.broker.list" -> s"${sys.props("ip.loc")}:9092")

  val topicsSet = "tx".split(",").toSet

  val range = Array(OffsetRange.create("tx", 0, 0, 1))

  //val messages = KafkaUtils.createDirectStream[String, String, StringDecoder, StringDecoder](
  //  ssc, kafkaParams, topicsSet)

  val rdd = KafkaUtils.createRDD[String, String, StringDecoder, StringDecoder](sc, kafkaParams, range)

  println(rdd.first().toString)
}
