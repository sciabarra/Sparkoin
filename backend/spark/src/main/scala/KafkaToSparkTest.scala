import java.util.Properties

import org.apache.kafka.clients.producer.{ProducerRecord, KafkaProducer}
import org.apache.log4j.{Level, Logger}
import _root_.kafka.serializer.StringDecoder
import org.apache.spark.streaming._
import org.apache.spark.streaming.kafka._
import org.apache.spark.SparkConf
import org.apache.spark.SparkContext

import scala.util.Random

/**
  * Created by msciab on 25/03/16.
  */
object KafkaToSparkTest extends App {

  val producer = new Thread {

    val props = new Properties();
    props.put("bootstrap.servers", "192.168.99.99:9092");
    props.put("acks", "all");
    props.put("retries", "0");
    props.put("batch.size", "16384");
    props.put("linger.ms", "1");
    props.put("buffer.memory", "33554432");
    props.put("key.serializer", "org.apache.kafka.common.serialization.StringSerializer");
    props.put("value.serializer", "org.apache.kafka.common.serialization.StringSerializer");

    val rnd = new Random
    var n = 0
    val producer = new KafkaProducer[String, String](props)

    var running = true
    override def run() {
      while (running) {
        n = n + 1
        val rec = new ProducerRecord[String, String]("sequence", n + ":" + Math.abs(rnd.nextLong))
        producer.send(rec)
        Thread.sleep(1000)
        print(".")
      }
    }
  }

  Logger.getLogger("org").setLevel(Level.OFF)
  Logger.getLogger("akka").setLevel(Level.OFF)

  producer.start()

  val conf = new SparkConf().setAppName("Test").setMaster("local")
  val sc = new SparkContext(conf)
  val ssc = new StreamingContext(sc, Seconds(1))

  val kafkaParams = Map[String, String]("metadata.broker.list" -> "192.168.99.99:9092")

  val topicsSet = "sequence".split(",").toSet

  val messages = KafkaUtils.createDirectStream[String, String, StringDecoder, StringDecoder](
    ssc, kafkaParams, topicsSet)

  messages.count()
  messages.print()

  messages.foreachRDD { rdd =>
    println(rdd)
  }

  ssc.start()
  Thread.sleep(20000)
  ssc.stop()

  producer.running = false

  //ssc.awaitTermination()
}
