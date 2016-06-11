var cassandra = require('cassandra-driver')
var client = new cassandra.Client({contactPoints: process.env.CASSANDRA_HOSTS.split(","), keyspace: 'sparkoin'})

var rowCount = 0
var maxId = -1
var SIZE = 512

var BitSet = require("bit-set")
var blockSet = new BitSet()

function findMax(id, size, callback) {
  var found = false
  var lastId = id
  client.eachRow('SELECT id FROM blockchain where token(id) > token(?) limit ?', [id, size],
  {autoPage: true, prepare: true, readTimeout: 0},
  function (n, row) {
    blockSet.set(row.id)
    lastId = row.id
    maxId = Math.max(maxId, lastId)
    found = true
  },
  function (err,result) {
    if(err) {
      if(size>=1) size = Math.floor(size / 2)
      console.log("error, retrying with size="+size)
      findMax(id, size)
    } else {
      rowCount += size
      if(found) {
        console.log("read count="+rowCount+" maxId="+maxId)
        findMax(lastId, SIZE)
      } else {
        console.log("final count="+rowCount+" maxId="+maxId)
        if(callback) callback()
      }
    }
  })
}

function dump() {
  for(i=0; i<maxId; i++) {
    if(!blockSet.get(i))
      console.log("missing "+i)
  }
}
findMax(0,SIZE, dump)
