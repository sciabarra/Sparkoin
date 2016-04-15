var process = require("process")
var fs = require("fs")
var bitcore = require("bitcore")
var index = require('bitcore-node');
var Node = index.Node;
var Bitcoin = index.services.Bitcoin;

// configure and start bitcon
var configuration = {
    datadir: '/app/bitcore/data',
    network: process.env.BITCOIN_NETWORK,
    services: [
        {
            name: 'bitcoind',
            module: Bitcoin,
            config: {}
        }
    ]
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

// configure and start kafka

var kafka = require('kafka-node'),
    Producer = kafka.Producer,
    client = new kafka.Client(process.env.KAFKA_CONNECT),
    producer = new Producer(client);

producer.on('ready', function () {
    producer.createTopics(['tx', "block"], true, function (err, data) {
        console.log("Topics Created");
    });
})

var beginInterval = Date.now();
var countBlock = 0;
var countTransactions = 0;

function countBlocksInInterval(interval) {
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
        ++currentBlock;
        node.services.bitcoind.getBlock(currentBlock, function (err, blockBuffer) {
            if (err) throw err;
            var block = bitcore.Block.fromBuffer(blockBuffer);
            //console.log(block);
            countBlocksInInterval(5000)
            payloads = []
            for (var i in block.transactions) {
                ++countTransactions;
                var transaction = block.transactions[i];
                var data = JSON.stringify(transaction.toJSON());
                //console.log(data);
                payloads.push(
                    {topic: 'tx', messages: data}
                );
            }
            var blockData = JSON.stringify(block.toJSON());
            payloads.push({topic: 'block', messages: blockData});
            producer.send(payloads, function (err, data) {
                //console.log(data);
                loadTransactions()
            });
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

  


