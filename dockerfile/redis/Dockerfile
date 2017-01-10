FROM centos-base:7
MAINTAINER Lhacker <starclown1@gmail.com>

ARG REDIS_VERSION=${REDIS_VERSION:-3.2.6}
ARG REDIS_CONF_DIR=/etc/redis

RUN set -x && \
: 'setup environment' && \
  yum update -y && yum clean all && \
: 'install redis' && \
  cd /usr/local/src && \
  curl -O http://download.redis.io/releases/redis-${REDIS_VERSION}.tar.gz && \
  tar -zxvf redis-${REDIS_VERSION}.tar.gz && \
  cd redis-${REDIS_VERSION} && \
  make && \
  make install && \
  cd .. && \
  rm -rf ./redis-${REDIS_VERSION}.tar.gz && \
  mkdir -v ${REDIS_CONF_DIR} && \
  :

COPY redis.conf ${REDIS_CONF_DIR}/

CMD redis-server ${REDIS_CONF_DIR}/redis.conf
