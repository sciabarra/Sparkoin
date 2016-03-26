import org.apache.log4j.{Level, Logger}
import _root_.kafka.serializer.StringDecoder
import org.apache.spark.streaming._
import org.apache.spark.streaming.kafka._
import org.apache.spark.SparkConf
import org.apache.spark.SparkContext

/**
  * Created by msciab on 25/03/16.
  */
object SparkConsumerTest extends App {

  Logger.getLogger("org").setLevel(Level.OFF)
  Logger.getLogger("akka").setLevel(Level.OFF)

  val conf = new SparkConf().setAppName("Test").setMaster("local")
  val sc = new SparkContext(conf)

  val ssc = new StreamingContext(sc, Seconds(1))

  val kafkaParams = Map[String, String]("metadata.broker.list" -> "192.168.99.99:9092")

  val topicsSet = "sequence".split(",").toSet

  val messages = KafkaUtils.createDirectStream[String, String, StringDecoder, StringDecoder](
    ssc, kafkaParams, topicsSet)

  //messages.count()
  //messages.print()

  messages.foreachRDD { rdd =>
    println(rdd)
  }

  ssc.start()
  Thread.sleep(10000)
  ssc.stop()
  //ssc.awaitTermination()
}
