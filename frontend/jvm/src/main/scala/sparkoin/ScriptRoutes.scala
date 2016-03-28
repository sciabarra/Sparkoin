package sparkoin

import java.util.Properties

import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.marshalling.ToResponseMarshaller
import akka.http.scaladsl.unmarshalling.FromRequestUnmarshaller
import org.apache.kafka.clients.producer.{ProducerRecord, KafkaProducer}

/**
  * Created by msciab on 12/03/16.
  */
trait ScriptRoutes extends KafkaUtil {

  val scriptRoutes = path("rev" / Segment) {
    data =>
      get {
        produce("reverse", data)
        complete(data.reverse)
      }
  }
}
