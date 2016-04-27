FROM sparkoin/java:2
RUN apt-get install -y openssh-client openssh-server
COPY config id_rsa id_rsa.pub /root/.ssh/ 
RUN cp /root/.ssh/id_rsa.pub /root/.ssh/authorized_keys ;\
 cp -Rvf /root/.ssh /app/.ssh ;\
 chmod 0600 /root/.ssh/* /app/.ssh/* ;\
 mkdir /app/data ;\
 chown app -Rvf /app  
RUN /etc/init.d/ssh start ; /etc/init.d/ssh stop
WORKDIR /app
EXPOSE 22
