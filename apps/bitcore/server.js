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

//var Web = index.services.Web;

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
  debug("MEM: avail="+mb(total - used)+" total="+mb(total)+" used="+mb(used)+" max="+mb(max))
}

var node = new Node(configuration);

node.on('ready', function () {
    info('Bitcoin Node Ready');
});

node.start(function () {
    var data = node.services.bitcoind.getInfo()
    currentHeight = data.blocks
    info('Bitcoin Node Start '+JSON.stringify(data))
    loadTransactions()
});

// connessione cassandra
var cassandra = require('cassandra-driver')
var client = new cassandra.Client({contactPoints: ['cassandra'], keyspace: 'sparkoin'})
var insertQuery = 'INSERT INTO sparkoin.blockchain(id, block_json) VALUES(?,?)'

// stats
var countBlocks = 0
var countTransactions = 0
var lastCheck = new Date().getTime()
var lastCheckMinTime = 1000000
var lastCheckMaxTime = 0

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

// load transactions and write them in hadoop

var currentBlock = -1
var currentHeight = -1

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
                info("*** (at " + data[0] + ") read #" + countBlocks + " blocks #" + countTransactions + " transactions")
                debug("*** lastCheckMinTime="+lastCheckMinTime+" lastCheckMaxTime="+lastCheckMaxTime)
                meminfo()
                lastCheck = now
                lastCheckMinTime = 1000000
                lastCheckMaxTime = 0
            }

            // if a write error, notify and go on
            if (err) {
                error(err)
            }
            // terminate and stop if reached a limit
            /*
            if ((process.env.BITCORE_STOP_AT &&
                (currentBlockChecked == process.env.BITCORE_STOP_AT))) {
                fs.writeFile("/app/data/bitcore/server.off", "")
                node.services.bitcoind.stop(function () {
                    process.exit(0);
                })
            }*/
        })
}


/**
 * Note function calls retrieveBlock
 * which in turn calls loadTransactions recursively
 */
var started = false
var BitSet = require("bit-set")
var blockSet = new BitSet()

function loadTransactions() {
    if (!started) {
      var rowCount = 0;
      client.stream('SELECT id FROM blockchain')
            .on('error', function (err) {
                error(err)
                setTimeout(loadTransactions, 1000)
            })
            .on('readable', function () {
                var row;
                while (row = this.read()) {
                     ++rowCount
                     blockSet.set(row.id)
                     if( (rowCount % 1000) == 0) {
                       nodebug("read count="+rowCount+" blockset cardinality="+blockSet.cardinality())
                      }
                }
            })
            .on('end', function () {
                info("***** started at current height="+currentHeight+" found #"+blockSet.cardinality())
                started = true
                currentBlock = 0
                loadTransactions()
            })
    } else if (currentBlock < currentHeight) {
        while(blockSet.get(currentBlock)) {
          ++currentBlock;
        }
        notrace("asking for block #" + currentBlock);
        var context = {"currentBlock": currentBlock}
        node.services.bitcoind.getBlock(currentBlock, function (err, blockBuffer) {
              context.err = err
              context.blockBuffer = blockBuffer
              retrieveBlock.call(context)
              ++currentBlock;
              loadTransactions()
        })
        checkStatus(currentBlock);
    } else {
      setTimeout(loadTransactions, 1000)
    }
}

node.services.bitcoind.on('tip', function (height) {
    debug("tip " + height)
    currentHeight = height
    // block retrieved, go for the next
    loadTransactions()
})

/*
 node.services.bitcoind.on('tx', function (txInfo) {
 console.log("tx " + txInfo.hash)
 loadSingleTransaction()
 });

 node.on('error', function (err) {
 console.error(err);
 });

 node.services.bitcoind.on('txleave', function (txLeaveInfo) {
 console.log("txleave " + JSON.stringify(txLeaveInfo))
 })
 */


//memwatch.on('stats', function (stats) { console.log(stats); })
