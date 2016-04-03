FROM debian:jessie
COPY ip.txt /etc/ip.txt
RUN sed -i -e 's/httpredir.debian.org/ftp.us.debian.org/' /etc/apt/sources.list 
RUN groupadd -g 1000 app && useradd -g 1000 -u 1000 -d /app app -m -s /bin/bash ; chown -Rv app:app /app/
RUN apt-get update && apt-get -y install git wget sudo curl vim net-tools python dos2unix
RUN mkdir /usr/java ; echo "app ALL=(ALL) NOPASSWD: ALL" >>/etc/sudoers ; sed -i 's/requiretty/!requiretty/' /etc/sudoers
ADD jdk* /usr/java/
COPY sbt sbt-launch.jar amm /usr/local/bin/
RUN ( echo export JAVA_HOME=$(ls -1d /usr/java/jdk*) ; echo PATH='$JAVA_HOME/bin:/usr/local/bin:$PATH' )>/etc/profile.d/java.sh  ; cat /etc/profile.d/java.sh >>/etc/bash.bashrc ; chmod +x /usr/local/bin/*
WORKDIR /app
