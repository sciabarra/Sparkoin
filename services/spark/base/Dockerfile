FROM sparkoin/java:5
WORKDIR /app
COPY url.txt *.tgz /app/
RUN FILE=$(cat url.txt) ; test -e $(basename $FILE)  || wget $FILE
RUN tar xzvf spark-*.tgz  ; rm *.tgz ; mv spark-* spark
