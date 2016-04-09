var kafka = require('kafka-node'),
    Producer = kafka.Producer,
    client = new kafka.Client("192.168.99.99:2181"),
    producer = new Producer(client);

var count = 0

function send() {
    payloads = [
        { topic: 'tx', messages: ['hi '+count] }
    ];
    producer.send(payloads, function (err, data) {
        console.log(data);
    });
    count = count + 1
    setTimeout(send, 500)
 }

producer.on('ready', function () {
   setTimeout(send, 0)
});

producer.on('error', function (err) {})
