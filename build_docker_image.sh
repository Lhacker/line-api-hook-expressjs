#!/bin/bash
SCRIPT_DIR=$(cd $(dirname $0); pwd)

EXPRESS_VERSION=${1:-latest}
TAG_VERSION=${2:-master}

docker build --force-rm --no-cache \
  --build-arg EXPRESS_VERSION=${EXPRESS_VERSION} \
  --build-arg EXPRESS_VIEW_OPTION=vash \
  --build-arg EXPRESS_ROOT=/app-root \
  --build-arg EXPRESS_APP_NAME=line-api-hook \
  -t line-api-hook/centos7-expressjs:${TAG_VERSION} ${SCRIPT_DIR}
