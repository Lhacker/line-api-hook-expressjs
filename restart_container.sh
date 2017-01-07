#!/bin/bash

SCRIPT_DIR=$(cd $(dirname $0); pwd)

function usage() {
  echo 'Usage:'
  echo "  $0"
  echo 'This script is just for debugging(reload new code)'
  exit 1
}

CONTAINER_NAME=line-api-hook-expressjs
docker stop ${CONTAINER_NAME}
docker start ${CONTAINER_NAME}
