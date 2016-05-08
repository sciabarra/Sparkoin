FROM sparkoin/spark:4
USER root
RUN sed -i -e 's/httpredir.debian.org/ftp.it.debian.org/' /etc/apt/sources.list
ENV DEBIAN_FRONTEND noninteractive
RUN apt-get update && apt-get install -yq --force-yes --no-install-recommends \
    git \
    vim \
    wget \
    build-essential \
    python-dev \
    python-pip \
    ca-certificates \
    bzip2 \
    unzip \
    libsm6 \
    pandoc \
    sudo \
    locales \
    libxrender1 \
    jq \
    && apt-get clean 
RUN echo "en_US.UTF-8 UTF-8" > /etc/locale.gen && locale-gen
# Install Tini
RUN wget --quiet https://github.com/krallin/tini/releases/download/v0.9.0/tini && \
    echo "faafbfb5b079303691a939a747d7f60591f2143164093727e870b289a44d9872 *tini" | sha256sum -c - && \
    mv tini /usr/local/bin/tini && \
    chmod +x /usr/local/bin/tini

RUN python2 -m pip install jupyter cql_kernel && ln -sf /app/spark /usr/local/spark
RUN chown -Rvf app /app