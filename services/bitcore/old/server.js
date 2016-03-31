var index = require('bitcore-node');
var Node = index.Node;
var Bitcoin = index.services.Bitcoin;
var DB = index.services.DB;
var Address = index.services.Address;

var Kafka = require('./kafka')

var old = DB.prototype.blockHandler

DB.prototype.blockHander = function(a,b,c) {

  console.log("hurra!")

  old(a,b,c)
}

var configuration = {
    datadir: '/app/bitcore/data',
    network: 'testnet',
    services: [
        {
            name: 'bitcoind',
            module: Bitcoin,
            config: {}
        },
        {
          name: "kafka",
          module: Kafka,
          config: {}
        },
        {
          name: "address",
          module: Address,
          config: {}
        },
        {
           name: 'db',
           module: DB,
           config: {}
        }
    ]
};

var node = new Node(configuration);

node.start(function() {
    console.log('Bitcoin Node Starting');
    console.log(node.services.bitcoind.getInfo())
});

node.on('ready', function() {
    console.log('Bitcoin Node Ready');
});

node.on('error', function(err) {
    console.error(err);
});

// shutdown the node
/*node.stop(function() {
    console.log('Bitcoin Node Stopping');
});*/   // the shutdown is complete

console.log(node.services.bitcoind.on)
node.services.bitcoind.on('tx', function(txInfo) {
  console.log("tx"+txInfo)
})
node.services.bitcoind.on('tip', function(txInfo) {
  console.log("tip"+txInfo)
})
node.services.bitcoind.on('txleave', function(txInfo) {
  console.log("txleave"+txInfo)
})

//console.log("**"+DB.prototype.blockHandler)
