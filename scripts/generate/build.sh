#!/usr/bin/env bash

set -euo pipefail

pushd scripts/generate
trap "popd" EXIT

docker build -t rode-ui-generate .
docker run \
  -it \
  --rm \
  -v $(pwd)/rode-client-nodejs:/rode-ui/proto/rode-client-nodejs \
  rode-ui-generate

rm -rf ../../rode-client-nodejs
mv rode-client-nodejs ../../
