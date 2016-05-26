function debug(msg) { /*
 console.log(msg)/**/
}

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

var node = new Node(configuration);

node.on('ready', function () {
    console.log('Bitcoin Node Ready');
});

node.start(function () {
    console.log('Bitcoin Node Starting');
    console.log(node.services.bitcoind.getInfo())
});

// connessione cassandra
var cassandra = require('cassandra-driver')
var client = new cassandra.Client({contactPoints: ['cassandra'], keyspace: 'sparkoin'})
var insertQuery = 'INSERT INTO sparkoin.blockchain(id, block_json) VALUES(?,?)'

countBlocks = 0
countTransactions = 0
lastCheck = new Date().getTime()

function checkStatus(currentBlockChecked) {

    debug("checkstatus for " + currentBlockChecked)

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
            } catch (err) {
            }
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
    debug("retrieved " + this.currentBlock)

    if (this.err)
        console.log(this.err);

    var toSave = decodeBlockBuffer(this.blockBuffer)
    //console.log("writing "+currentBlock)
    var data = [this.currentBlock, JSON.stringify(toSave)]
    client.execute(insertQuery, data, {prepare: true},
        function (err) {

            // display an informative message every 10 seconds
            var now = new Date().getTime()
            if (now - lastCheck > 10000) {
                lastCheck = now
                console.log("*** (at " + data[0] + ") read #" + countBlocks + " blocks #" + countTransactions + " transactions")
            }

            // terminate if a write error, hoping a restart can solve
            if (err) {
                console.log(err)
                node.services.bitcoind.stop(function () {
                    process.exit(0);
                })
            }
            // terminate and stop if reached a limit
            else if ((process.env.BITCORE_STOP_AT &&
                (currentBlockChecked == process.env.BITCORE_STOP_AT))) {
                fs.writeFile("/app/data/bitcore/server.off", "")
                node.services.bitcoind.stop(function () {
                    process.exit(0);
                })
            }
        })

    // block retrieved, go for the next
    loadTransactions()
}


/**
 * Note function calls retrieveBlock
 * which in turn calls loadTransactions recursively
 */
var started = false
function loadTransactions() {
    if (!started) {
        client.stream('SELECT id FROM blockchain')
            .on('error', function (err) {
                console.log(err)
                setTimeout(loadTransactions, 1000)
            })
            .on('readable', function () {
                var row
                while (row = this.read()) {
                     if( (row.id % 1000) == 0)
                       console.log(row.id)
                    currentBlock = Math.max(currentBlock, row.id)
                }
            })
            .on('end', function () {
                console.log("*** restarting from " + currentBlock)
                started = true
                loadTransactions()
            })
    } else if (currentBlock < currentHeight) {
        ++currentBlock;
        checkStatus(currentBlock);
        debug("asking for " + currentBlock);
        var context = {"currentBlock": currentBlock}
        node.services.bitcoind.getBlock(currentBlock, function (err, blockBuffer) {
            context.err = err
            context.blockBuffer = blockBuffer
            retrieveBlock.call(context)
        })
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
