FROM sparkoin/jupyter-base:5

ENV JAVA_HOME=/usr/java/jdk
ENV SPARK_HOME /app/spark
ENV SPARK_OPTS --driver-java-options=-Xms1024M --driver-java-options=-Xmx4096M --driver-java-options=-Dlog4j.logLevel=info

RUN pip3 install notebook ; pip2 install ipython jupyter_client cql_kernel

#RUN pip install toree && jupyter toree install --user --kernel_name='Toree' \

RUN mkdir -p /app/apps/jupyter/conf /app/apps/jupyter/local &&\
 ln -sf /app/spark /usr/local/spark && mkdir -p /app/.local/share/jupyter
RUN chown -Rvf app /app
USER app
WORKDIR /app
RUN pip3 install https://github.com/ipython-contrib/IPython-notebook-extensions/archive/master.zip --user
COPY jupyter.sh /app/jupyter.sh
RUN curl -L -o jupyter-scala https://git.io/vzhR7 &&\
 chmod +x jupyter-scala &&\
 PATH=/usr/java/jdk/bin:$PATH ./jupyter-scala &&\
 rm -f jupyter-scala &&\
 python2 -m cql_kernel.install cassandra.loc

WORKDIR /app
COPY apps.tar /app/
RUN tar xvf /app/apps.tar -C /app ; rm /app/apps.tar
WORKDIR /app/apps/jupyter
ENTRYPOINT ["tini", "--"]
CMD bash /app/jupyter.sh
