FROM THE TOP LEVEL

You can run (in 3 different shells...)

docker-compose up
sbt "b/runMain KafkaProducerTest"
sbc "b/runMain SparkConsumerTest"
