FROM sparkoin/zeppelin-base:5
COPY zeppelin.sh /app/
COPY interpreter.json /app/zeppelin/conf
RUN chown -Rvf app:app /app ; chmod -R 0755 /app ; dos2unix /app/*.sh
USER app
CMD bash zeppelin.sh
