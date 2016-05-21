FROM sparkoin/jupyter-base:5
ENV JAVA_HOME=/usr/java/jdk
ENV SPARK_HOME /app/spark
ENV SPARK_OPTS --driver-java-options=-Xms1024M --driver-java-options=-Xmx4096M --driver-java-options=-Dlog4j.logLevel=info
USER root
RUN pip3 install notebook &&\
    pip2 install jupyter cql_kernel &&\
    ln -sf /app/spark /usr/local/spark &&\
    mkdir -p /app/.local/share/jupyter &&\
    chown -Rvf app /app
USER app
WORKDIR /app
RUN curl -L -o jupyter-scala https://git.io/vzhR7 &&\
 chmod +x jupyter-scala &&\
 PATH=/usr/java/jdk/bin:$PATH ./jupyter-scala &&\
 rm -f jupyter-scala &&\
 python -m cql_kernel.install cassandra.loc
COPY jupyter.sh apps.tar /app/
RUN tar xvf /app/apps.tar -C /app ; rm /app/apps.tar
WORKDIR /app/apps/jupyter
ENTRYPOINT ["tini", "--"]
RUN pip3 install https://github.com/ipython-contrib/IPython-notebook-extensions/archive/master.zip --user
RUN echo "c.NotebookApp.tornado_settings = { 'headers': { 'Content-Security-Policy': \"frame-ancestors *\" } }" >>/app/.jupyter/jupyter_notebook_config.py
CMD bash /app/jupyter.sh
