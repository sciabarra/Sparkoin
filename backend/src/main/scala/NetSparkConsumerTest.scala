import org.apache.spark.SparkConf
import org.apache.spark.SparkContext
import org.apache.spark.streaming._

//import org.slf4j.LoggerFactory
//import ch.qos.logback.classic.Level
//import ch.qos.logback.classic.Logger

import org.apache.log4j._
/**
  * Created by msciab on 25/03/16.
  */
object NetSparkConsumerTest extends App {

  Logger.getLogger("org").setLevel(Level.OFF)
  Logger.getLogger("akka").setLevel(Level.OFF)

  val conf = new SparkConf().setAppName("Test").setMaster("local[2]")
  val sc = new SparkContext(conf)

  val ssc = new StreamingContext(sc, Seconds(5))

  val lines = ssc.socketTextStream("localhost", 9999)

  val words = lines.flatMap(_.split(" "))
  val pairs = words.map(word => (word, 1))
  val wordCounts = pairs.reduceByKey(_ + _)
  wordCounts.print()
  ssc.start()
  ssc.awaitTermination()
}
