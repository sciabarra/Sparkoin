var process = require("process")
var bitcore = require("bitcore")
var index = require('bitcore-node');
var Node = index.Node;
//var blockDataVar = require('./livenet-345003.json');
var blockDataVar = require('./testnet-block.json');
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
        transactionData["outputs"] = outputs
        transactionData["inputs"] = inputs
        console.log(transactionData)
        //var data = JSON.stringify(transactionData);
        //console.log(data);
/*
        payloads.push(
            {topic: 'tx', messages: data}
        );
*/
    }
    console.log(payloads)
}




