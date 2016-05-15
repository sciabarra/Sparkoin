package samples

import org.json4s.FieldSerializer._
import org.json4s.jackson.Serialization
import org.json4s.{FieldSerializer, ShortTypeHints}

/**
  * Created by jelerak on 19/04/2016.
  */
object DataModel {

  implicit val formats = Serialization.formats(ShortTypeHints(List(classOf[TxInput], classOf[TxOutput]))) +
    FieldSerializer[Tx](
      renameTo("tx_id", "hash") orElse renameTo("version_no", "version")  orElse renameTo("lock_time", "nLockTime"),
      renameFrom("hash", "tx_id") orElse renameFrom("version", "version_no") orElse renameFrom("nLockTime", "lock_time")) +
    FieldSerializer[BlockHeader](
      renameTo("prev_hash", "prevHash") orElse renameTo("merkle_root", "merkleRoot"),
      renameFrom("prevHash", "prev_hash") orElse renameFrom("merkleRoot", "merkle_root"))

  case class BlockHeader(hash: String, version: Int, prev_hash: String, merkle_root: String, time: Long, bits: Long, nonce: Long)

  case class Block(block_id: String, block_height: Int, tx_number: Int, difficulty: Double, header: BlockHeader)

  case class TxInput(previous_tx_hash: String, output_tx_id: Long, script_sig: String, sequence_no: Long, address: String)

  case class TxOutput(value: Long, script_pub_key: String, address: String)

  case class Tx(tx_id: String, block_id: String, block_time: Long, version_no: Int, tx_in_list: List[TxInput], tx_out_list: List[TxOutput], lock_time: Int)

  case class TxOutDetail(id: String, tx_id: String, amount: Long, receiver: String, when: Long)

  case class FullBlock(block: Block, tx: List[Tx])

}
