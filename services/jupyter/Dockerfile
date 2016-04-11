FROM sparkoin/java:2
ENV JAVA_HOME=/usr/java/jdk1.8.0_65
RUN apt-get install -y python-dev python-pip unzip ; pip install jupyter panda
USER app
RUN git clone https://github.com/alexarchambault/jupyter-scala ; cd jupyter-scala ; sbt scala-cli/packArchive ; chmod +x bin/jupyter-scala ; ./bin/jupyter-scala ; mkdir -p /app/jupyter/data
EXPOSE 8888
WORKDIR /app/jupyter/data
VOLUME /app/jupyter/data
CMD jupyter notebook --ip=$(hostname -i) --no-browser
