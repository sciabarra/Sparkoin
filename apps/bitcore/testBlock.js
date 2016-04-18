var process = require("process")
var bitcore = require("bitcore")
var index = require('bitcore-node');
var Node = index.Node;
var blockDataVar = require('./livenet-345003.json');
//var blockDataVar = require('./testnet-block.json');
//var Bitcoin = index.services.Bitcoin;

// configure and start bitcon
var configuration = {
    datadir: '/app/data/bitcore',
/*
    network: process.env.BITCOIN_NETWORK,
    services: [
        {
            name: 'bitcoind',
            module: Bitcoin,
            config: {}
        }
    ]
*/
};

var node = new Node(configuration);

node.start(function () {
    console.log('Bitcoin Node Starting');
    loadTransactions()
});

node.on('ready', function () {
    console.log('Bitcoin Node Ready');
});

var countTransactions = 0;

function loadTransactions() {
    var block = bitcore.Block.fromString(blockDataVar)
    payloads = []

    var blockHeader = block.header.toJSON()
    blockHeader["difficulty"] = block.header.getDifficulty()
    var blockData = {
        block_id: blockHeader.hash,
        tx_number: block.transactions.length,
        header: blockHeader
    }

    payloads.push({topic: 'block', messages: JSON.stringify(blockData)});

    for (var i in block.transactions) {
        ++countTransactions;
        var transaction = block.transactions[i].toJSON();
        transaction["block_id"] = blockHeader.hash
        var data = JSON.stringify(transaction);
        //console.log(data);
/*
        payloads.push(
            {topic: 'tx', messages: data}
        );
*/
    }
    console.log(payloads)
}




