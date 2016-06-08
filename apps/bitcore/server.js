var process = require("process")

// how many concurrent inserts ? servers * 10
var cassandraHosts = process.env.CASSANDRA_HOSTS.split(",")
var CONCURRENT_INSERTS = 100 * cassandraHosts.length
var MAX_WRITE_WAIT = 60000 // a minute it is a bit too much - tune the concurrent inserts

// logging
function error(msg) {//*
  console.log("ERROR: "+msg)/**/
}
function info(msg) {//*
  console.log("INFO : "+msg)/**/
}
function trace(msg) {//*
  console.log("TRACE: "+msg)/**/
}

var fs = require("fs")
var bitcore = require("bitcore")
var index = require('bitcore-node');

var Node = index.Node;
var Bitcoin = index.services.Bitcoin;
var Address = index.services.Address;
var DB = index.services.DB;

// configure and start bitcon
var configuration = {
    datadir: '/app/data/bitcore',
    network: process.env.BITCOIN_NETWORK,
    services: [
        {
            name: "address",
            module: Address,
            config: {}
        }, {
            name: 'bitcoind',
            module: Bitcoin,
            config: {}
        }, {
            name: 'db',
            module: DB,
            config: {}
        } ]
};

var node = new Node(configuration);

// connessione cassandra
var cassandra = require('cassandra-driver')
var client = new cassandra.Client({contactPoints: process.env.CASSANDRA_HOSTS.split(","), keyspace: 'sparkoin'})
var insertQuery = 'INSERT INTO sparkoin.blockchain(id, block_json) VALUES(?,?)'

// status
var currentBlock = 0
var currentHeight = 0
var started = false
var fetchSize = 4096

// stats
var BitSet = require("bit-set")
var blockSet = new BitSet()
var countBlocks = 0
var countTransactions = 0
var lastCheck = new Date().getTime()
var lastCheckMinTime = 1000000
var lastCheckMaxTime = 0
var lastCountBlocks = 0
var lastCountTransactions = 0
var countRunningInserts = 0

// info memory usage
function meminfo() {
  function mb(n) {
    var n1 = n / (1024*1024)
    return Math.floor(n1) +"mb "
  }
  var mem = process.memoryUsage()
  var max = mem.rss
  var total = mem.heapTotal
  var used = mem.heapUsed
  //"MEM: avail="+mb(total - used)+
  return " tot="+mb(total)+" use="+mb(used)+" max="+mb(max)
}

// graceful terminate
function terminate() {
  started = 0
  node.services.bitcoind.stop(function() {
      process.exit(0)
  })
}

function checkStatus() {

    //notrace("checkstatus for " + currentBlockChecked)

    // check if we need to exit
    fs.exists('/app/data/bitcore/server.off', function(exists){
      if(exists)
        terminate()
    })

    // check if we need to restart
    fs.exists('/app/data/bitcore/server.restart', function (exists) {
        if (exists) {
            try {
                fs.unlinkSync('/app/data/bitcore/server.restart')
            } catch (err) { }
            terminate()
        }
    })
}

// decode block buffer
function decodeBlockBuffer(blockBuffer) {

    ++countBlocks
    var block = bitcore.Block.fromBuffer(blockBuffer);
    var blockHeader = block.header.toJSON()
    var blockData = {
        block_id: blockHeader.hash,
        block_height: this.currentRetrievedBlock,
        tx_number: block.transactions.length,
        difficulty: block.header.getDifficulty(),
        header: blockHeader
    }

    payloads = []
    for (var i in block.transactions) {
        ++countTransactions;
        var transaction = block.transactions[i];
        var outputs = []
        var inputs = []
        for (var io in transaction.outputs) {
            var output = transaction.outputs[io]
            var script = output.script
            if(script) {
               var address = script.toAddress()
               outputs.push({
                  script_pub_key: script.toString(),
                  address: address.toString(),
                  value: output.satoshis
               })
            }
        }
        for (var ii in transaction.inputs) {
            if (!transaction.isCoinbase()) {
                var input = transaction.inputs[ii]
                var script = input.script
                if(script) {
                  var address = script.toAddress()
                  var prevTxId = input.toObject().prevTxId
                  inputs.push({
                    previous_tx_hash: prevTxId,
                    output_tx_id: input.outputIndex,
                    sequence_no: input.sequenceNumber,
                    script_sig: script.toString(),
                    address: address.toString()
                  })
                }
            }
        }

        //console.log(transaction)
        transactionData = transaction.toJSON()
        transactionData["block_id"] = blockHeader.hash
        transactionData["block_time"] = blockHeader.time
        transactionData["tx_out_list"] = outputs
        transactionData["tx_in_list"] = inputs
        var data = transactionData;
        //console.log(transactionData)
        payloads.push(data);
    }
    return {block: blockData, tx: payloads}
}

// load transactions and write them in cassandra
function retrieveBlock() {

    // write the block
    //trace("retrieved " + this.currentBlock)

    if (this.err)
        error(this.err);

    var toSave = decodeBlockBuffer(this.blockBuffer)
    //trace("writing "+currentBlock)
    var data = [this.currentBlock, JSON.stringify(toSave)]
    var beginInsert = Date.now()
    ++countRunningInserts
    var context = this
    client.execute(insertQuery, data, {prepare: true},
        function (err) {
            --countRunningInserts

            if (err) {
              error("write error! retrying "+data[0])
              askForBlock(data[0])
              data = null
              return
            }

            // collect stats
            var now = new Date().getTime()
            var insertTime = (now-beginInsert)
            lastCheckMinTime = Math.min(lastCheckMinTime, insertTime)
            lastCheckMaxTime = Math.max(lastCheckMaxTime, insertTime)

            // display an informative message every 10 seconds
            if (now - lastCheck > 10000) {
                info(data[0] + ") ins#"+countRunningInserts+" blk#" + (countBlocks-lastCountBlocks) +  " tx#" + (countTransactions-lastCountTransactions) + " maxTime:"+lastCheckMaxTime+"ms |"+meminfo())
                lastCountBlocks = countBlocks
                lastCountTransactions = countTransactions
                if(started && lastCheckMaxTime >MAX_WRITE_WAIT) {
                  CONCURRENT_INSERTS = Math.floor(CONCURRENT_INSERTS/2)
                  info("!!! writes are too slow, lowering concurrent writes to "+CONCURRENT_INSERTS)
                  if(CONCURRENT_INSERTS==1)
                    terminate()
                }
                lastCheck = now
                lastCheckMinTime = 1000000
                lastCheckMaxTime = 0
            }
            data = null
        })
}

function findMissingBlocks() {
  var resyncRowCount = 0
  var resyncMaxId = -1

  client.eachRow('SELECT id FROM blockchain', [],
    {autoPage: true, fetchSize: fetchSize},
    function (n, row) {
       ++resyncRowCount;
       blockSet.set(row.id)
       resyncMaxId = Math.max(resyncMaxId, row.id)
       if( (resyncRowCount % 10000) == 0) {
         checkStatus()
         info("resync count="+resyncRowCount+ " maxId="+resyncMaxId+" fetchSize="+fetchSize)
       }
    },
    function (err, result) {
      // even if there is an error... best effort done
      if(err && fetchSize >1) {
        //console.log(err)
        fetchSize = Math.floor(fetchSize / 2)
        info("!!! read error, reducing fetch size to "+fetchSize)
        findMissingBlocks()
     } else {
       info("resync final count="+resyncRowCount+ " maxId="+resyncMaxId)
       currentHeight = Math.max(currentHeight, resyncMaxId)
       started = 1
       loadTransactions()
     }
    })
}

function askForBlock(blockNum, callback) {
  //trace("asking for block #" + blockNum);
  var context = {"currentBlock": blockNum}
  node.services.bitcoind.getBlock(blockNum,
    function (err, blockBuffer) {
        context.err = err
        context.blockBuffer = blockBuffer
        retrieveBlock.call(context)
        if(callback) callback()
    })
}

function loadTransactions() {
    checkStatus();
    if (!started)
       return;

    // too many running transactions retry later
    if(countRunningInserts > CONCURRENT_INSERTS) {
      setTimeout(loadTransactions, CONCURRENT_INSERTS*100)
      return;
    }

    if (currentBlock <= currentHeight) {
        while(blockSet.get(currentBlock))
          ++currentBlock;
        var blockWriting = currentBlock
        askForBlock(currentBlock, function() {
          blockSet.set(blockWriting)
          ++currentBlock;
          loadTransactions()
        })
        return;
    }

    // retry later
    setTimeout(loadTransactions, 1000)
}


node.on('ready', function () {
    info('Bitcoin Node Ready');
});

node.start(function () {
    var data = node.services.bitcoind.getInfo()
    currentHeight = data.blocks
    info('Bitcoin Node Started '+JSON.stringify(data))
    findMissingBlocks()
});

node.services.bitcoind.on('tip', function (height) {
    info("tip " + height)
    // block retrieved, go for the next
    loadTransactions()
})

fs.writeFile("server.pid", process.pid)
