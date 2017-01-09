FROM centos7-nodejs:v7.0.0
MAINTAINER Lhacker <starclown1@gmail.com>

ARG EXPRESS_VERSION=${EXPRESS_VERSION:-latest}
ARG EXPRESS_VIEW_OPTION=${EXPRESS_VIEW_OPTION:-vash}
ARG EXPRESS_ROOT=${EXPRESS_ROOT:-/app-root}
ARG EXPRESS_APP_NAME=${EXPRESS_APP_NAME:-line-api-hook}
ARG EXPRESS_APP_DIR=${EXPRESS_ROOT}/${EXPRESS_APP_NAME}
ARG EXPRESS_APP_SSLCERT_DIR=${EXPRESS_APP_DIR}/sslcert

RUN set -x && \
: 'setup environment' && \
  yum update -y && yum clean all && \
  mkdir -pv ${EXPRESS_ROOT} && \
  mkdir -pv ${EXPRESS_APP_DIR} && \
  mkdir -pv ${EXPRESS_APP_SSLCERT_DIR} && \
: 'install express' && \
  npm install -g express-generator@${EXPRESS_VERSION} && \
  cd ${EXPRESS_ROOT} && \
  express -f -v ${EXPRESS_VIEW_OPTION} ${EXPRESS_APP_NAME} && \
  cd ${EXPRESS_APP_DIR} && \
  sed -i 's/^  }$/  },/g' package.json && \
  sed -i '/^}$/i\  "license": "MIT"' package.json && \
  npm install && \
: 'install extra packages' && \
  npm install xml2js --save

WORKDIR ${EXPRESS_APP_DIR}

CMD ["npm", "start"]
