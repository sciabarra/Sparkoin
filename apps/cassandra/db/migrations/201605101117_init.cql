CREATE TABLE sparkoin.blockchain(
    id int primary key,
    block_json text
) with caching={ 'keys': 'none', 'rows_per_partition': '0' };
