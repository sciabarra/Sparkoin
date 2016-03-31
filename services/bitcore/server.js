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
    producer.createTopics(['tx'], true, function (err, data) {
        console.log("Topic Created");
    });
})


// load transactions
var currentBlock = -1
var currentHeight = -1

function loadTransactions() {
    if (currentBlock < currentHeight) {
        ++currentBlock;
        node.services.bitcoind.getBlock(currentBlock, function (err, blockBuffer) {
            if (err) throw err;
            var block = bitcore.Block.fromBuffer(blockBuffer);
            console.log(block);
            payloads = []
            for (var i in block.transactions) {
                var transaction = block.transactions[i];
                var data = JSON.stringify(transaction.toJSON());
                //console.log(data);
                payloads.push(
                    {topic: 'tx', messages: [data]}
                );
            }
            producer.send(payloads, function (err, data) {
                //console.log(data);
                loadTransactions()
            });
        })
    }
}


node.services.bitcoind.on('tip', function (height) {
    console.log("tip " + height)
    currentHeight = height
    loadTransactions()
});

/*
 node.on('error', function (err) {
 console.error(err);
 });

 node.services.bitcoind.on('tx', function (txInfo) {
 console.log("tx " + JSON.stringify(txInfo))
 })

 node.services.bitcoind.on('txleave', function (txLeaveInfo) {
 console.log("txleave " + JSON.stringify(txLeaveInfo))
 })
 */

  


