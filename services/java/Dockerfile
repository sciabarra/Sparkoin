FROM sparkoin/java-base:5
COPY uid.txt /etc/
RUN tar xzvf /sw/jdk* -C /usr/java ; ln -sf /usr/java/jdk1* /usr/java/jdk ;  rm -Rvf /sw ; rm -Rvf /usr/java/jdk/db /usr/java/jdk/lib/missioncontrol /usr/java/jdk/lib/visualvm /usr/java/jdk/*.zip
RUN groupadd -g $(cat /etc/uid.txt) app && useradd -g $(cat /etc/uid.txt) -u $(cat /etc/uid.txt) -d /app app -m -s /bin/bash ; chown -Rv app:app /app/
RUN echo "app ALL=(ALL) NOPASSWD: ALL" >>/etc/sudoers ; sed -i 's/requiretty/!requiretty/' /etc/sudoers
RUN ( echo export JAVA_HOME=/usr/java/jdk ; echo PATH='$JAVA_HOME/bin:/usr/local/bin:$PATH' )>>/etc/profile 
WORKDIR /app
