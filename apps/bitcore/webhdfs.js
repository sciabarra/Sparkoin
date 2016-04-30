var WebHDFS = require('webhdfs');
var hdfs = WebHDFS.createClient({
   user: 'app',
   host: 'hadoop.loc',
   port: 50070,
   path: '/webhdfs/v1'
});
function printErr(err) { if(err) console.log(err) }
n = 12345
dir = "/blockchain/"+(""+n).split("").join("/")
console.log(dir)
hdfs.mkdir(dir, printErr)
hdfs.writeFile(dir+"/block.json", "hello world\n", function(err) {
   if(err)
      console.log(err)
   else hdfs.appendFile("/test/test-file", "hello world 2\n", printErr)
})

//var Readable = require('stream').Readable
//var inp = new Readable()
//inp.push("hello")
//var out = hdfs.createWriteStream('/test/test-file-2') 
//inp.pipe(out)
//for(i=0; i<100; i++)
//  inp.push("data "+i+"\n")
//out.on('finish', function() { print("done") ; })
