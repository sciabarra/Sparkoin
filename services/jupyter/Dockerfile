FROM sparkoin/java:2
ENV JAVA_HOME=/usr/java/jdk1.8.0_65
RUN apt-get install -y python-dev python-pip unzip curl ; pip install jupyter panda
USER app
RUN curl -L -o jupyter-scala-2.10 https://git.io/vzhR7 && chmod +x jupyter-scala-2.10 && env PATH=$JAVA_HOME/bin:$PATH ./jupyter-scala-2.10 && rm -f jupyter-scala-2.10 ; mkdir -p /app/jupyter/data
EXPOSE 8888
WORKDIR /app/jupyter/data
VOLUME /app/jupyter/data
CMD jupyter notebook --ip=$(hostname -i) --no-browser
