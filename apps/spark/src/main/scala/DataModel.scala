/**
  * Created by jelerak on 19/04/2016.
  */
object DataModel {

  case class BlockHeader(hash: String, version: Int, prev_hash: String, merkle_root: String, time: Long, bits: Long, nonce: Long)

  case class Block(block_id: String, block_height: Int, tx_number: Int, difficulty: Double, header: BlockHeader)

  case class TxInput(previous_tx_hash: String, output_tx_id: Long, script_sig: String, sequence_no: Long, address: String)

  case class TxOutput(value: Long, script_pub_key: String, address: String)

  case class Tx(tx_id: String, block_id:String, version_no: Int, tx_in_list: List[TxInput], tx_out_list: List[TxOutput], lock_time: Int)



}
