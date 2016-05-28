var cassandra = require('cassandra-driver')
var BitSet = require("bit-set")

var client = new cassandra.Client({contactPoints: ['cassandra.loc'], keyspace: 'sparkoin'})
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
 client.metadata.getTable('sparkoin', 'blockchain', function(err, result) {
      if(err) {
           console.log("*** metadata not yet ready")
      } else {
           client.shutdown()
           //console.log("*** metadata successul")
           process.exit(0);
       }
       //console.log("recurse checkTable")
       setTimeout(checkTable, 1000)
    })
}
wait4cassandra()
