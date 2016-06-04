#import os
#contact_points = os.environ['CASSANDRA_HOSTS'].split(",")
#migration_master = 'CASSANDRA_MASTER' in os.environ

contact_points = ["cassandra.loc"]
migration_master = True

username = None
password = None
keyspace = 'sparkoin'
replication = { 'class' : 'SimpleStrategy', 'replication_factor' : 2 }

solr_url = 'http://127.0.0.1:8983/solr'

