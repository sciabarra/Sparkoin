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

// connessione hdfs
var WebHDFS = require('webhdfs');
var hdfs = WebHDFS.createClient({
    user: 'app',
    host: 'hadoop.loc',
    port: 50070,
    path: '/webhdfs/v1'
});

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
            var address = script.toAddress()
            outputs.push({
                script_pub_key: script.toString(),
                address: address.toString(),
                value: output.satoshis
            })
        }
        for (var ii in transaction.inputs) {
            if (!transaction.isCoinbase()) {
                var input = transaction.inputs[ii]
                var script = input.script
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
    var currentBlockChecked = this.currentBlock
    hdfs.writeFile('/blockchain/' + this.currentBlock + '.json',
        JSON.stringify(toSave),
        function (err) {
            var now = new Date().getTime()
            if (now - lastCheck > 10000) {
                lastCheck = now
                // salve checkpoint
                hdfs.writeFile('/blockchain.last', ""+currentBlockChecked, function () {
                    console.log("*** (at "+currentBlockChecked+") read #" + countBlocks + " blocks #" + countTransactions + " transactions")
                })
            }
            if (err)
                console.log(err)
            // limiting the number of blocks to retrieve
            if (process.env.BITCORE_STOP_AT)
                if (currentBlockChecked == process.env.BITCORE_STOP_AT) {
                    fs.writeFile("/app/data/bitcore/server.off", "")
                    node.services.bitcoind.stop(function () {
                        process.exit(0);
                    })
                    return
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
    // wait until properly hadoop it starts
    if (!started) {
        hdfs.readdir("/blockchain", function (err, files) {
            if (err) {
                console.log(err)
                hdfs.mkdir('/blockchain', function (err) {
                    if (err) {
                        console.log(err)
                        setTimeout(loadTransactions, 1000)
                    } else {
                        started = true
                        loadTransactions()
                    }
                })
            } else {
                // find the highest non-empty loaded file named XXX.json
                for(var i = 0 ; i < files.length; i++) {
                    var file = files[i]
                    var n = parseInt(file.pathSuffix.split(".")[0])
                    //console.log(file)
                    if(file.length >0 && n==n) {
                        currentBlock = Math.max(currentBlock, n)
                    }
                }
                console.log("*** restarting from " + currentBlock)
                started = true
                loadTransactions()
            }
        })
        return;
    }

    if (currentBlock < currentHeight) {
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


