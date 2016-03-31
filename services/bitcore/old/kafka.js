function Kafka(options) {

  if( !(this instanceof Kafka)) {
    return new Kafka(options); 
  }
  if(!options) 
    options = {}
}

Kafka.dependencies = [];

Kafka.prototype.start = function(callback) {
 console.log("Kafka starting");
}

Kafka.prototype.stop = function(callback) {
 console.log("Kafka stopping");
}

Kafka.prototype.blockHandler = function(block, add, callback) {
 console.log(block);
}

module.exports = Kafka




