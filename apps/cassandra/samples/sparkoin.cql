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

ALTER TABLE sparkoin.tx ADD block_id varchar;

ALTER TABLE sparkoin.tx ADD block_time varchar;

CREATE TYPE IF NOT EXISTS sparkoin.block_header (
  hash varchar,
  version int,
  prev_hash varchar,
  merkle_root varchar,
  time bigint,
  bits bigint,
  nonce bigint
);

CREATE TABLE IF NOT EXISTS sparkoin.block(
    block_id varchar primary key,
    block_height bigint,
    tx_number int,
    difficulty float,
    header FROZEN<block_header>
);

ALTER TYPE sparkoin.tx_input ADD address varchar;
ALTER TYPE sparkoin.tx_output ADD address varchar;

CREATE TABLE IF NOT EXISTS sparkoin.tx_out_detail(
    id varchar primary key,
    tx_id varchar,
    amount bigint,
    receiver varchar,
    when bigint,
);

CREATE TABLE IF NOT EXISTS sparkoin.offsets(
    topic varchar,
    partition smallint,
    offset bigint,
    PRIMARY KEY (topic, partition)
);

INSERT INTO sparkoin.offsets(topic, partition, offset) VALUES ('tx', 0, 0);
INSERT INTO sparkoin.offsets(topic, partition, offset) VALUES ('block', 0, 0);

CREATE TABLE IF NOT EXISTS sparkoin.transactions(
    id varchar primary key,
    when timestamp,
    sender varchar,
    receiver varchar,
    amount decimal
);
