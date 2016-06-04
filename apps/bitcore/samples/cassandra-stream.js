var cassandra = require('cassandra-driver')
var client = new cassandra.Client({contactPoints: process.env.CASSANDRA_HOSTS.split(","), keyspace: 'sparkoin'})
var rowCount = 0
client.stream('SELECT id FROM blockchain', {autoPage: true})
.on('error', function (err) {
              console.log(err)
})
.on('readable', function () {
                var row;
                while (row = this.read()) {
                     ++rowCount
                     if( (rowCount % 10000) == 0) {
                       console.log("read count="+rowCount)
                      }
                }
})
 .on('end', function () {
                console.log("***** end at "+rowCount)
            })

