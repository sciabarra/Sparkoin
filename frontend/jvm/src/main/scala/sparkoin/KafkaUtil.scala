package sparkoin

import java.util.Properties

import org.apache.kafka.clients.producer.{KafkaProducer, ProducerRecord}

/**
  * Created by msciab on 13/03/16.
  */
trait KafkaUtil {
  val props = new Properties

  props.put("acks", "all")
  props.put("retries", "3")
  props.put("batch.size", "16384")
  props.put("linger.ms", "1")
  props.put("buffer.memory", "33554432")
  props.put("bootstrap.servers", "192.168.99.100:9092")
  props.put("key.serializer", "org.apache.kafka.common.serialization.StringSerializer")
  props.put("value.serializer", "org.apache.kafka.common.serialization.StringSerializer")
  val producer = new KafkaProducer[String,String](props)

  def produce(topic: String, data: String): Unit = {
    val rec = new ProducerRecord[String, String](topic, data)
    producer.send(rec)
    producer.flush()
  }
  def close = {
    producer.close
  }
}
