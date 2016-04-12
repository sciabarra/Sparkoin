FROM sparkoin/java:2
ENV JAVA_HOME=/usr/java/jdk1.8.0_65
RUN apt-get install -y python-dev python-pip unzip curl 
RUN pip install jupyter panda toree
USER app
EXPOSE 8888
WORKDIR /app/jupyter/data
VOLUME /app/jupyter/data
CMD jupyter notebook --ip=$(hostname -i) --no-browser
