package sparkoin

import akka.actor.ActorSystem
import akka.event.LoggingAdapter
import akka.stream.ActorMaterializer
import com.typesafe.config.Config
import com.typesafe.scalalogging.LazyLogging
import scala.concurrent.ExecutionContextExecutor
import akka.http.scaladsl.server.Directives._

/**
 * Serve http requests for static files
 */
trait StaticRoutes extends LazyLogging {

  val config: Config

  val staticRoutes = pathSingleSlash {
    logger.debug("index.html")
    getFromFile(config.getString("files.home"))
  } ~ pathPrefix("app") {
    val app = config.getString("directories.app")
    logger.debug(s"${app}")
    getFromBrowseableDirectory(app)
  } ~ pathPrefix("lib") {
    val lib = config.getString("directories.lib")
    logger.debug(s"${lib}")
    getFromBrowseableDirectory(lib)
  } ~ pathPrefix("web") {
    val web = config.getString("directories.web")
    logger.debug(s"${web}")
    getFromBrowseableDirectory(web)
  }
}
