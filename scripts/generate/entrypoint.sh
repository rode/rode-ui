#!/usr/bin/env bash

set -euo pipefail

cd rode

GRPC_NODE_PATH="/rode-ui/proto/node_modules/grpc-tools/bin/"
GRPC_NODE_PLUGIN_PATH="$GRPC_NODE_PATH/grpc_node_plugin"
PATH=$PATH:"$GRPC_NODE_PATH"

GOOGLE_API_PROTOS=("annotations" "client" "field_behavior" "http" "resource")
cd protodeps/googleapis

for api in "${GOOGLE_API_PROTOS[@]}"; do
    protoc --proto_path . \
      --plugin=protoc-gen-grpc=$GRPC_NODE_PLUGIN_PATH \
      --js_out=import_style=commonjs,binary:../../../rode-client-nodejs/ \
      --grpc_out=grpc_js:../../../rode-client-nodejs \
       google/api/$api.proto
done

cd ../..

GOOGLE_API_RPC_PROTOS=("status")
cd protodeps/googleapis

for api in "${GOOGLE_API_RPC_PROTOS[@]}"; do
    protoc --proto_path . \
      --plugin=protoc-gen-grpc=$GRPC_NODE_PLUGIN_PATH \
      --js_out=import_style=commonjs,binary:../../../rode-client-nodejs/ \
      --grpc_out=grpc_js:../../../rode-client-nodejs \
       google/rpc/$api.proto
done

cd ../..

cd protodeps/grafeas
GRAFEAS_PROTOS=("grafeas" "vulnerability" "build" "image" "package" "deployment" "attestation" "intoto" "common" "provenance" "source" "discovery" "cvss" "project")
function generate {
    protoc --proto_path . \
      --proto_path ../googleapis \
      --plugin=protoc-gen-grpc=$GRPC_NODE_PLUGIN_PATH \
      --js_out=import_style=commonjs,binary:../../../rode-client-nodejs/ \
      --grpc_out=grpc_js:../../../rode-client-nodejs \
       proto/v1beta1/$1.proto
}

for api in "${GRAFEAS_PROTOS[@]}"; do
    generate "${api}"
done

cd ../..

protoc \
  --proto_path=./protodeps/grafeas \
  --proto_path=./protodeps/googleapis \
  --proto_path=. \
  --plugin=protoc-gen-grpc=$GRPC_NODE_PLUGIN_PATH \
  --js_out=import_style=commonjs,binary:../rode-client-nodejs/ \
  --grpc_out=grpc_js:../rode-client-nodejs \
  ./proto/v1alpha1/*.proto
