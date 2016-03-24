FROM anapsix/alpine-java:8
RUN apk update && apk add procps python && adduser -h /app -D app
WORKDIR /app
COPY ip.txt /etc/ip.txt
CMD /bin/bash
