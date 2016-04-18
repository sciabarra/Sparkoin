

CREATE TABLE IF NOT EXISTS sparkoin.transactions(
    id varchar primary key,
    when timestamp,
    sender varchar,
    receiver varchar,
    amount decimal
);

