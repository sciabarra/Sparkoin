package sparkoin

/**
 * Created with IntelliJ IDEA.
 * User: chiradip
 * Date: 4/9/14
 * Time: 1:10 AM
 * To change this template use File | Settings | File Templates.
 */

import java.io._
import java.net.Socket

import org.slf4j._

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent._
import scala.util.{Failure, Success}

class RedisClient(host: String = "127.0.0.1", port: Int = 6379, idx: Int = 0) {
  private val log = LoggerFactory.getLogger(getClass)
  val socket = new Socket(host, port)
  val out = new PrintWriter(socket.getOutputStream, true)

  val in = new BufferedReader(new InputStreamReader(socket.getInputStream))

  log.debug(s"selecting Redis index: $idx")
  if(idx!=0)
    send(s"USE $idx")

  def send(command: String): Future[String] = {
    out.println(command)
    val sb = new StringBuilder(1)

    future {
      while(in.ready) {
        sb+in.read.asInstanceOf[Char]
      }
      val string = sb.toString()
      log.debug(s""" $string """)
      val l = string.split("\r\n").toList
      val list = l.filter(s=> !s.startsWith("$"))

      val finalString = decode(list).mkString("\n")
      log.debug(finalString)
      finalString
      //string
    }
  }

  def decode(list: List[String]): List[String] = {
    val token = list.reverse.find(_.startsWith("*")).getOrElse("*-1") //Last StarredElem

    if(token == "*-1") list
    else {
      val numElems = token.substring(1,token.length).toInt

      def lastIndexOf(list: List[String], token: String) = {
        list.length -1 - list.reverse.indexOf(token)
      }

      val lastIndex = lastIndexOf(list, token)

      val firstSlice = list.slice(0,lastIndex)

      log.debug("firstSlice: " + firstSlice.mkString(" || "))

      val secondSlice = list.slice(lastIndex+1, lastIndex + 1 + numElems)

      log.debug("2ndSlice: " + secondSlice.mkString(" || "))

      val thirdSlice = list.slice(lastIndex + 2 + numElems, list.length)

      log.debug("3rdSlice: " + thirdSlice.mkString(" || "))

      val innerStr = "{[" + secondSlice.mkString(", ") + "]}"

      val finalList = firstSlice ::: (innerStr :: thirdSlice)

      decode(finalList)
    }
  }

  def handleResponse(f: Future[String], fun: Any => Any) {
    f onComplete {
      case Success(resp) => fun(resp)
      case Failure(t) => log.error(t.getMessage)
    }
  }
}

case class RedisClientException(exc: Exception)
