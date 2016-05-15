FROM sparkoin/java-base:5
COPY uid.txt /etc/
RUN groupadd -g $(cat /etc/uid.txt) app && useradd -g $(cat /etc/uid.txt) -u $(cat /etc/uid.txt) -d /app app -m -s /bin/bash ; chown -Rv app:app /app/
RUN echo "app ALL=(ALL) NOPASSWD: ALL" >>/etc/sudoers ; sed -i 's/requiretty/!requiretty/' /etc/sudoers
RUN ( echo export JAVA_HOME=/usr/java/jdk ; echo PATH='$JAVA_HOME/bin:/usr/local/bin:$PATH' )>>/etc/profile 
USER app
WORKDIR /app
COPY apps.tar /app/
RUN tar xvf /app/apps.tar -C /app ; rm /app/apps.tar
WORKDIR /app/apps/java
USER root

