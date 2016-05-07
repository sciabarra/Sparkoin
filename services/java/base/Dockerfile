FROM debian:jessie
RUN sed -i -e 's/httpredir.debian.org/ftp.us.debian.org/' /etc/apt/sources.list
RUN apt-get update && apt-get -y install git wget sudo curl vim net-tools python dos2unix && apt-get clean 
RUN wget -nc -O/tmp/jdk-8u65-linux-x64.tar.gz --progress=dot:giga --no-cookies --no-check-certificate \
      --header "Cookie: gpw_e24=http%3A%2F%2Fwww.oracle.com%2F; oraclelicense=accept-securebackup-cookie" \
      http://download.oracle.com/otn-pub/java/jdk/8u65-b17/jdk-8u65-linux-x64.tar.gz && \
    wget -nc -O/usr/local/bin/sbt-launch.jar https://repo.typesafe.com/typesafe/ivy-releases/org.scala-sbt/sbt-launch/0.13.11/sbt-launch.jar && \
    wget -nc -O/usr/local/bin/amm https://github.com/lihaoyi/Ammonite/releases/download/0.5.7/ammonite-repl-0.5.7-2.10.5 && \
    wget -nc -O/usr/local/bin/sbt https://raw.githubusercontent.com/paulp/sbt-extras/master/sbt
RUN mkdir /usr/java ; tar xzvf /tmp/jdk-8u65-linux-x64.tar.gz -C /usr/java/ ; chmod +x /usr/local/bin/* ; rm -rvf /tmp/* 
