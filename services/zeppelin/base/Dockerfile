FROM sparkoin/java:5
WORKDIR /app
COPY url.txt *.tgz /app/
RUN FILE=$(cat url.txt) ; test -e $(basename $FILE)  || wget $FILE
RUN tar xzvf zeppelin-*.tgz  ; rm *.tgz ; mv zeppelin-* zeppelin
RUN wget http://central.maven.org/maven2/com/google/guava/guava/16.0.1/guava-16.0.1.jar
