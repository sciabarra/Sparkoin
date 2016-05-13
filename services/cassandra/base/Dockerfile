FROM sparkoin/java:5
RUN apt-get -y install python-pip python-dev netcat && pip install trireme
WORKDIR /app
COPY url.txt *.tar.gz /app/
RUN FILE=$(cat url.txt) ; test -e $(basename $FILE)  || wget $FILE
RUN tar xzvf apache-cassandra-*.tar.gz  ; rm *.tar.gz ; mv apache-cassandra-* cassandra
