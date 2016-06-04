CREATE TABLE sparkoin.blockchain(
    id int primary key,
    block_json text
) with caching={ 'keys': 'ALL', 'rows_per_partition': 'NONE' };
