CREATE KEYSPACE IF NOT EXISTS sparkoin with replication= {'class': 'SimpleStrategy', 'replication_factor' : 1};

CREATE TYPE IF NOT EXISTS sparkoin.tx_input (
  previous_tx_hash varchar,
  output_tx_id int,
  script_sig varchar,
  sequence_no int
);

CREATE TYPE IF NOT EXISTS sparkoin.tx_output (
  value bigint,
  script_pub_key varchar,
);

CREATE TABLE IF NOT EXISTS sparkoin.tx(
    tx_id varchar primary key,
    version_no int,
    tx_in_list list<FROZEN <tx_input>>,
    tx_out_list list<FROZEN <tx_output>>,
    lock_time int
);
