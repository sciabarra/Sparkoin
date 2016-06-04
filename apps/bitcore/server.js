function trace(msg) {//*
  console.log("TRACE: "+msg)/**/
}
function debug(msg) {//*
  console.log("DEBUG: "+msg)/**/
}
function info(msg) {//*
  console.log("INFO : "+msg)/**/
}
function error(msg) {//*
  console.log("ERROR: "+msg)/**/
}
function notrace() {}
function nodebug() {}

var process = require("process")
var fs = require("fs")
var bitcore = require("bitcore")
var index = require('bitcore-node');

// disabled as they are slowing down a lot
//var InsightAPI = require('insight-api')
//var InsightUI = require('insight-ui/bitcore-node')

var Node = index.Node;
var Bitcoin = index.services.Bitcoin;
var Address = index.services.Address;
var DB = index.services.DB;


var currentBlock = 0
var currentHeight = 0


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
        } /*, {
         name: 'web',
         module: Web,
         config: {
         port: 3001
         }
         } , {
         name: 'insight-api',
         module: InsightAPI ,
         config: {}
         }, {
         name: 'insight-ui',
         module: InsightUI ,
         config: {}
         } */]
};

fs.writeFile("server.pid", process.pid)

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

var node = new Node(configuration);

// connessione cassandra
var cassandra = require('cassandra-driver')
var client = new cassandra.Client({contactPoints: process.env.CASSANDRA_HOSTS.split(","), keyspace: 'sparkoin'})
var insertQuery = 'INSERT INTO sparkoin.blockchain(id, block_json) VALUES(?,?)'

// stats
var countBlocks = 0
var countTransactions = 0
var lastCheck = new Date().getTime()
var lastCheckMinTime = 1000000
var lastCheckMaxTime = 0
var lastCountBlocks = 0
var lastCountTransactions = 0

function checkStatus(currentBlockChecked) {

    notrace("checkstatus for " + currentBlockChecked)

    // check if we need to exit
    fs.exists('/app/data/bitcore/server.off', function (exists) {
        if (exists)
            node.services.bitcoind.stop(
                function () {
                    process.exit(0);
                })
    })

    // check need of restart
    fs.exists('/app/data/bitcore/server.restart', function (exists) {
        if (exists) {
            try {
                fs.unlinkSync('/app/data/bitcore/server.restart')
            } catch (err) { }
            node.services.bitcoind.stop(
                function () {
                    process.exit(0);
                })
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


/**
 * Block retrieval function
 * Expect in this:
 *  - blockBuffer
 *  - currentBlock
 *  - err
 */
function retrieveBlock() {

    // write the block
    notrace("retrieved " + this.currentBlock)

    if (this.err)
        error(this.err);

    var toSave = decodeBlockBuffer(this.blockBuffer)
    //console.log("writing "+currentBlock)
    var data = [this.currentBlock, JSON.stringify(toSave)]
    var beginInsert = Date.now()
    client.execute(insertQuery, data, {prepare: true},
        function (err) {
            var now = new Date().getTime()

            var insertTime = (now-beginInsert)
            lastCheckMinTime = Math.min(lastCheckMinTime, insertTime)
            lastCheckMaxTime = Math.max(lastCheckMaxTime, insertTime)

            // display an informative message every 10 seconds
            if (now - lastCheck > 10000) {
                info(data[0] + ") blk#" + (countBlocks-lastCountBlocks) +  " tx#" + (countTransactions-lastCountTransactions) + " maxTime:"+lastCheckMaxTime+"ms |"+meminfo())
                lastCountBlocks = countBlocks
                lastCountTransactions = countTransactions
                if(lastCheckMaxTime >10000) {
                  info("!!! writes are too slow, restarting")
                  node.services.bitcoind.stop(
                      function () {
                          process.exit(0);
                      })
                }
                lastCheck = now
                lastCheckMinTime = 1000000
                lastCheckMaxTime = 0
            }
            data[0].currentBlock = null
            data = null

            // if a write error, notify and go on
            if (err) {
                error(err)
            }
        })
}

/**
 * Note function calls retrieveBlock
 * which in turn calls loadTransactions recursively
 */
var started = false
var BitSet = require("bit-set")
var blockSet = new BitSet()

function findMissingBlocks() {
  var rowCount = 0;
  var maxId = -1;
  client.eachRow('SELECT id FROM blockchain', [], {autoPage: true},
    function (n, row) {
       ++rowCount;
       blockSet.set(row.id)
       maxId = Math.max(maxId, row.id)
       if( (rowCount % 10000) == 0) {
            console.log("resync count="+rowCount+ " maxId="+maxId)
       }
    },
    function (err, result) {
      if(err) {
       console.log(err)
       blockSet = new BitSet()
       setTimeout(findMissingBlocks, 1000)
     } else {
       console.log("resync final count="+rowCount+ " maxId="+maxId)
       for(i=0; i<=maxId; i++) {
         if(!blockSet.get(i)) {
           console.log("missing "+i)
           askForBlock(i)
         }
       }
       currentHeight = Math.max(currentHeight, maxId)
       started = 1
       loadTransactions()
     }
    })
}

function askForBlock(blockNum, callback) {
  notrace("asking for block #" + currentBlock);
  var context = {"currentBlock": currentBlock}
  node.services.bitcoind.getBlock(currentBlock,
    function (err, blockBuffer) {
        context.err = err
        context.blockBuffer = blockBuffer
        retrieveBlock.call(context)
        ++currentBlock;
        if(callback) callback()
    })
}

function loadTransactions() {
    if (!started)
       return;
    if (currentBlock <= currentHeight) {
        while(blockSet.get(currentBlock)) {
          ++currentBlock;
        }
        askForBlock(currentBlock, loadTransactions)
        checkStatus(currentBlock);
    } else {
      setTimeout(loadTransactions, 1000)
    }
}


node.on('ready', function () {
    //info('Bitcoin Node Ready');
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
