var bitcore = require("bitcore")
var index = require('bitcore-node');
var Node = index.Node;
var Bitcoin = index.services.Bitcoin;

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

var node = new Node(configuration);

node.start(function () {
    console.log('Bitcoin Node Starting');
    console.log(node.services.bitcoind.getInfo())
});

node.on('ready', function () {
    console.log('Bitcoin Node Ready');
});

node.on('error', function (err) {
    console.error(err);
});

node.services.bitcoind.on('tx', function (txInfo) {
    console.log("tx " + JSON.stringify(txInfo))
})
node.services.bitcoind.on('tip', function (blockHash) {
    console.log("tip " + JSON.stringify(blockHash))
    node.services.bitcoind.getBlock(blockHash, function (err, blockBuffer) {
        if (err) {
            throw err;
        }
        var block = bitcore.Block.fromBuffer(blockBuffer);
        console.log(block);
/*
        for (var i in block.transactions) {
          var transaction = block.transactions[i];
          console.log(transaction.toJSON()) 
        }
*/
        console.log("===========")
    });
  

})
node.services.bitcoind.on('txleave', function (txLeaveInfo) {
    console.log("txleave " + JSON.stringify(txLeaveInfo))
})

