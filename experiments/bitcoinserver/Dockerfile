FROM debian:jessie
ADD https://github.com/libbitcoin/libbitcoin-server/releases/download/v2.4.0/bs-linux-x64-consensus-mainnet /usr/sbin/bs
ADD https://github.com/libbitcoin/libbitcoin-explorer/releases/download/v2.2.0/bx-linux-x64-mainnet /usr/bin/bx
ADD bs.sh /usr/bin/bs.sh
COPY bs.cfg /etc/bs.cfg
RUN mkdir /var/blockchain ; chmod 0755 /usr/sbin/bs /usr/bin/bx /usr/bin/bs.sh
CMD /usr/bin/bs.sh
EXPOSE 8333
EXPOSE 9091
EXPOSE 9092
EXPOSE 9093
EXPOSE 9094
