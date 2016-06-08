var cassandra = require('cassandra-driver')

var client = new cassandra.Client({contactPoints: process.env.CASSANDRA_HOSTS.split(","), keyspace: 'sparkoin'})
var ok = false

function wait4cassandra() {
    client.connect(function(err) {
    if(err) {
          console.log("*** still waiting for cassandra")
          if(err.toString().indexOf("sparkoin") == -1)
            setTimeout(wait4cassandra, 3000)
	        else
	          setTimeout(checkTable, 1000);
        } else {
	   checkTable()
        }
    })
}

function checkTable() {
 console.log("checkTable")
 client.eachRow('SELECT id FROM sparkoin.blockchain limit 1', [],
    {autoPage: true},
     function (n, row) { }, 
     function(err, result) {
      if(err) {
           console.log("*** metadata not yet ready")
           setTimeout(checkTable, 1000)
      } else {
           console.log("*** metadata ready")
           client.shutdown()
           process.exit(0);
      }
       //console.log("recurse checkTable")
    })
}
wait4cassandra()
