var insertQuery = 'INSERT INTO blockchain(id,block_json) VALUES(?,?)'

function query() {
    client.stream('SELECT id FROM blockchain')
        .on('readable', function () {
            var row
            while (row = this.read())
                console.log(row)
        })
        .on('end', function () {
            console.log("end")
        })
        .on('error', function (err) {
            console.log(err)
        })
}

client.execute(insertQuery, [1, "test"], {prepare: true}, function (err) {
    query()
})

client.execute(insertQuery, [2, "test2"], {prepare: true}, function (err) {
    query()
})

client.execute(insertQuery, [3, "test3"], {prepare: true}, function (err) {
    query()
})
