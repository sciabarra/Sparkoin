CREATE TABLE sparkoin.blockchain(
    id int primary key,
    block_json text
) with caching={ 'keys': 'NONE', 'rows_per_partition': '0' };
