import DataModel._
import com.datastax.spark.connector._
import org.apache.spark.{SparkConf, SparkContext}


/**
  * Created by jelerak on 25/03/16.
  */
object AnalyzeTransactions extends App {

  val conf = new SparkConf(true).set("spark.cassandra.connection.host", "192.168.99.99").set("spark.cassandra.connection.port", "9042").setMaster("local").setAppName("SparkToCassandra")
  val sc = new SparkContext(conf)

  val rdd = sc.cassandraTable[Tx]("sparkoin", "tx")

  val txout = rdd.flatMap(tx => {
    tx.tx_out_list.filter(out => out.address != "false").map(out => {
      def uuid = java.util.UUID.randomUUID.toString
      new TxOutDetail(uuid, tx.tx_id, out.value, out.address, tx.block_time)
    })
  })

  txout.saveToCassandra("sparkoin", "tx_out_detail")
}


