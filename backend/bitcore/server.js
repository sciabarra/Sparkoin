var bitcore = require("bitcore")
var index = require('bitcore-node');
var Node = index.Node;
var Bitcoin = index.services.Bitcoin;

var kafka = require('kafka-node'),
    Producer = kafka.Producer,
    client = new kafka.Client("192.168.99.99:2181"),
    producer = new Producer(client);


var configuration = {
    datadir: '/app/bitcore/data',
    network: 'livenet',
    services: [
        {
            name: 'bitcoind',
            module: Bitcoin,
            config: {}
        }
    ]
};

var last = -1
var node = new Node(configuration);

node.start(function () {
    console.log('Bitcoin Node Starting');
    console.log(node.services.bitcoind.getInfo())
});

node.on('ready', function () {
    console.log('Bitcoin Node Ready');
});

producer.on('ready', function () {
    //producer.createTopics(['tx'], true, function (err, data) {
    //   console.log("Topic Created");
    //});
})

node.on('error', function (err) {
    console.error(err);
});

/*
 node.services.bitcoind.on('tx', function (txInfo) {
 console.log("tx " + JSON.stringify(txInfo))
 })

 node.services.bitcoind.on('txleave', function (txLeaveInfo) {
 console.log("txleave " + JSON.stringify(txLeaveInfo))
 })
 */

node.services.bitcoind.on('tip', function (height) {
    console.log("tip " + height)
    while (last < height) {
        ++last;
        node.services.bitcoind.getBlock(last, function (err, blockBuffer) {
            if (err) throw err;
            var block = bitcore.Block.fromBuffer(blockBuffer);
            console.log(block);

            if (last == 1) {
                payloads = [
                    {topic: 'tx', messages: ['hi' + last]}
                ];
                producer.send({topic: 'tx', messages: ['hi' + i]}, function (err, data) {
                    console.log(data);
                });
            }

            for (var i in block.transactions) {
                var transaction = block.transactions[i];
                var data = JSON.stringify(transaction.toJSON());
                console.log(data);
                payloads = [
                    {topic: 'tx', messages: [data]}
                ];
                producer.send(payloads, function (err, data) {
                    console.log(data);
                });
            }
        })
    }
});
  


