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
    } */ ]
};

fs.writeFile("server.pid", process.pid)

var node = new Node(configuration);

node.start(function () {
    console.log('Bitcoin Node Starting');
    console.log(node.services.bitcoind.getInfo())
});

node.on('ready', function () {
    console.log('Bitcoin Node Ready');
});

// connessione hdfs
var WebHDFS = require('webhdfs');
var hdfs = WebHDFS.createClient({
    user: 'app',
    host: 'hadoop.loc',
    port: 50070,
    path: '/webhdfs/v1'
});


var beginInterval = Date.now();
var countBlock = 0;
var countTransactions = 0;

function checkStatus(interval) {
  var now = Date.now()
  if( now - beginInterval > interval) {
    console.log("*** seen "+countBlock+" blocks "+countTransactions+" transactions  in latest "+interval+" milliseconds")
    beginInterval = now;
    countBlock = 0;
    countTransactions = 0;
  } else {
    countBlock = countBlock + 1;
  }
  // check if we need to exit
  fs.exists('/app/data/bitcore/server.off', function(exists)  {
    if(exists) 
     node.services.bitcoind.stop( 
       function() { process.exit(0); })
   })
   // check need of restart
   fs.exists('/app/data/bitcore/server.restart', function(exists)  {
    if(exists) {
     try { fs.unlinkSync('/app/data/bitcore/server.restart') } catch(err) {}
     node.services.bitcoind.stop( 
       function() { process.exit(0); })
    }
   })
}

// load transactions and write them in hadoop

var currentBlock = -1
var currentHeight = -1
var currentRetrievedBlock = -1;
var started = false

function loadTransactions() {
    if(!started) {
        hdfs.mkdir('/blockchain', function (err) {
            if (err) {
                console.log(err)
            } else {
                started = true
            }
            loadTransactions()
        })
        return;
    }

    checkStatus(10000);
    if (currentBlock < currentHeight) {
        ++currentBlock;

        // limiting the number of blocks to retrieve
        if (process.env.BITCORE_STOP_AT) {
            if (currentBlock >= process.env.BITCORE_STOP_AT) {
                fs.writeFile("/app/data/bitcore/server.off", "")
                node.services.bitcoind.stop(function () { process.exit(0);})
            }
        }

        //console.log("retrieving "+currentBlock)
        node.services.bitcoind.getBlock(currentBlock, function (err, blockBuffer) {
            if (err)
                console.log(err);

            ++currentRetrievedBlock
            var block = bitcore.Block.fromBuffer(blockBuffer);

            var blockHeader = block.header.toJSON()
            var blockData = {
                block_id: blockHeader.hash,
                block_height: currentRetrievedBlock,
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

            var toSave = {block: blockData, tx: payloads}
            //console.log("writing "+currentBlock)
            hdfs.writeFile('/blockchain/' + currentRetrievedBlock + '.json', JSON.stringify(toSave),
                function () {
                    if (err)
                        console.log(err)
                    loadTransactions()
                })
        })
    }
}

node.services.bitcoind.on('tip', function (height) {
    //console.log("tip " + height)
    currentHeight = height
    loadTransactions()
});


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

  


