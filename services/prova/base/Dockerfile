FROM sparkoin/java-base:4
WORKDIR /app
COPY url.txt *.tar.gz /app/ 
RUN FILE=$(cat url.txt) ; test -e $(basename $FILE)  || wget $FILE
