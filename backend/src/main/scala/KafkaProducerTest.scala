import java.util.Properties

import org.apache.kafka.clients.producer.{ProducerRecord, KafkaProducer, ProducerConfig}

import scala.util.Random

/**
  * Created by msciab on 25/03/16.
  */
object KafkaProducerTest extends App {
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

  while (true) {
    n = n + 1
    val rec = new ProducerRecord[String, String]("sequence", n + ":" + Math.abs(rnd.nextLong))
    producer.send(rec)
    Thread.sleep(1000)
    print(".")
  }

}
