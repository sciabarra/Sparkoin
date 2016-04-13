TGT=jupyter
docker build -t sparkoin/$TGT:2 $TGT
docker run -p 8888:8888 -ti sparkoin/$TGT:2 "$@"
