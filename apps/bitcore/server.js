var process = require("process")
var fs = require("fs")
var bitcore = require("bitcore")
var index = require('bitcore-node');


// api
var InsightAPI = require('insight-api')
var InsightUI = require('insight-ui/bitcore-node')

// connessione hdfs
var WebHDFS = require('webhdfs');
var hdfs = WebHDFS.createClient({
   user: 'app',
   host: 'hadoop.loc',
   port: 50070,
   path: '/webhdfs/v1'
});

// setup the server
var Node = index.Node;
var Bitcoin = index.services.Bitcoin;
var Address = index.services.Address;
var DB = index.services.DB;
var Web = index.services.Web;

// configure and start bitcon and other services
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
    }, {
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
    } ]
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

// init counters
var beginInterval = Date.now();
var countBlock = 0;
var countTransactions = 0;

/**
 * Check control requests and log status
 */
function checkControlRequest(interval) {
  // check if we need to exit
  fs.exists('/tmp/server.off', function(exists)  {
    if(exists)
     node.services.bitcoind.stop(
       function() { process.exit(0); })
   })
   // check need of restart
   fs.exists('/tmp/server.restart', function(exists)  {
    if(exists) {
     try { fs.unlinkSync('/tmp/server.restart') } catch(err) {}
     node.services.bitcoind.stop(
       function() { process.exit(0); })
    }
   })

  // display status message
  var now = Date.now()
  if( now - beginInterval > interval) {
    console.log("*** seen "+countBlock+" blocks "+countTransactions+" transactions  in latest "+interval+" milliseconds")
    beginInterval = now;
    countBlock = 0;
    countTransactions = 0;
  } else {
    countBlock = countBlock + 1;
  }
}

// load transactions
var currentBlock = -1
var currentHeight = -1

function loadTransactions() {

    if (currentBlock < currentHeight) {
        currentBlock++;

        node.services.bitcoind.getBlock(currentBlock,
          function (err, blockBuffer) {
            if (err) throw err;
            checkControlRequest(10000) // check status at every block received

            // gather block
            var block = bitcore.Block.fromBuffer(blockBuffer);
            var blockHeader = block.header.toJSON()
            var blockData = {
                block_id: blockHeader.hash,
                block_height: currentBlock,
                tx_number: block.transactions.length,
                difficulty: block.header.getDifficulty(),
                header: blockHeader,
                payloads: []
            }


            // gather transactions
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
                        address:address.toString(),
                        value: output.satoshis})
                }
                for (var ii in transaction.inputs) {
                    if (! transaction.isCoinbase()) {
                        var input = transaction.inputs[ii]
                        var script = input.script
                        var address = script.toAddress()
                        var prevTxId = input.toObject().prevTxId
                        inputs.push({
                            previous_tx_hash: prevTxId,
                            output_tx_id: input.outputIndex,
                            sequence_no: input.sequenceNumber,
                            script_sig: script.toString(),
                            address:address.toString()})
                    }
                }
                //console.log(transaction)
                transactionData = transaction.toJSON()
                transactionData["block_id"] = blockHeader.hash
                transactionData["block_time"] = blockHeader.time
                transactionData["tx_out_list"] = outputs
                transactionData["tx_in_list"] = inputs
                //console.log(transactionData)
                payloads.push(transactionData)
            }
            // store transactions
            blockData.payloads = payloads
            // write in hadoop
            hdfs.writeFile('/blockchain/'+currentBlock+'.json', JSON.stringify(blockData),  function(err) {
                if(err) console.log(err)
                else  loadTransactions()
            })
        })
    }
}

node.services.bitcoind.on('tip', function (height) {
    //console.log("tip " + height)
    currentHeight = height
    hdfs.mkdir('/blockchain', function(err) {
      if(err)
        console.log(err)
      loadTransactions()
    })
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
