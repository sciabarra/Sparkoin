FROM sparkoin/jupyter-base:4
USER app
ENV CONDA_DIR /app/conda
ENV PATH $CONDA_DIR/bin:$PATH
ENV SHELL /bin/bash
ENV LC_ALL en_US.UTF-8
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US.UTF-8
ENV JAVA_HOME=/usr/java/jdk1.8.0_65
ENV SPARK_HOME /app/spark
ENV PYTHONPATH $SPARK_HOME/python:$SPARK_HOME/python/lib/py4j-0.9-src.zip
ENV SPARK_OPTS --driver-java-options=-Xms1024M --driver-java-options=-Xmx4096M --driver-java-options=-Dlog4j.logLevel=info

RUN mkdir -p /app/apps/jupyter/conf /app/apps/jupyter/local && \
    mkdir /app/conda && \
    echo "cacert=/etc/ssl/certs/ca-certificates.crt" > /app/.curlrc

RUN cd /tmp && \
    wget --quiet https://repo.continuum.io/miniconda/Miniconda3-3.19.0-Linux-x86_64.sh && \
    echo "9ea57c0fdf481acf89d816184f969b04bc44dea27b258c4e86b1e3a25ff26aa0 *Miniconda3-3.19.0-Linux-x86_64.sh" | sha256sum -c - && \
    /bin/bash Miniconda3-3.19.0-Linux-x86_64.sh -f -b -p /app/conda && \
    rm Miniconda3-3.19.0-Linux-x86_64.sh && \
    /app/conda/bin/conda install --quiet --yes conda==3.19.1 && \
    conda clean -tipsy

RUN conda install --quiet --yes \
    'notebook=4.1*' \
    terminado \
    && conda clean -tipsy

RUN pip install 'jupyterhub==0.5'

WORKDIR /app
COPY jupyter.sh /app/jupyter.sh 
RUN curl -L -o jupyter-scala https://git.io/vzhRi &&\
 chmod +x jupyter-scala &&\
 PATH=/usr/java/jdk1.8.0_65/bin:$PATH ./jupyter-scala &&\
 rm -f jupyter-scala 
RUN conda install --quiet --yes \
    'ipywidgets=4.1*' \
    'pandas=0.17*' \
    'numexpr=2.5*' \
    'matplotlib=1.5*' \
    'scipy=0.17*' \
    'seaborn=0.7*' \
    'scikit-learn=0.17*' \
    && conda clean -tipsy \
    && pip install toree \
    && jupyter toree install --user --kernel_name='Toree' \
    && python2 -m cql_kernel.install cassandra.loc
RUN pip install https://github.com/ipython-contrib/IPython-notebook-extensions/archive/master.zip --user
ENTRYPOINT ["tini", "--"]
WORKDIR /app/apps/jupyter
CMD bash /app/jupyter.sh
