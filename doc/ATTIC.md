# snippets of documentation no more valid but potentially useful

## CASSANDRA

Note: Cassandra is currently disabled, however this script is still available

`exec-cql.sh <args>` execute cql

in particular:

`run-cql.sh -f  sparkcoin.cql` will create the schema in cassandra

`start-jobs.sh <job>` execute a  spark job inside the container

The important job is: `ImportTransactionsFromOffset`

So:

- initialize with `exec-cql -f sparkoin.cql`
- run `./start-jobs.sh ImportTransactionsFromOffset`

you will end up with the transactions (and the blocks) imported in Cassandra.
~
