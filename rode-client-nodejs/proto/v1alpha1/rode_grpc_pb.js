// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var proto_v1alpha1_rode_pb = require('../../proto/v1alpha1/rode_pb.js');
var proto_v1alpha1_rode$attest_pb = require('../../proto/v1alpha1/rode-attest_pb.js');
var proto_v1beta1_grafeas_pb = require('../../proto/v1beta1/grafeas_pb.js');

function serialize_rode_v1alpha1_AttestPolicyRequest(arg) {
  if (!(arg instanceof proto_v1alpha1_rode$attest_pb.AttestPolicyRequest)) {
    throw new Error('Expected argument of type rode.v1alpha1.AttestPolicyRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_rode_v1alpha1_AttestPolicyRequest(buffer_arg) {
  return proto_v1alpha1_rode$attest_pb.AttestPolicyRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rode_v1alpha1_AttestPolicyResponse(arg) {
  if (!(arg instanceof proto_v1alpha1_rode$attest_pb.AttestPolicyResponse)) {
    throw new Error('Expected argument of type rode.v1alpha1.AttestPolicyResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_rode_v1alpha1_AttestPolicyResponse(buffer_arg) {
  return proto_v1alpha1_rode$attest_pb.AttestPolicyResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rode_v1alpha1_BatchCreateOccurrencesRequest(arg) {
  if (!(arg instanceof proto_v1alpha1_rode_pb.BatchCreateOccurrencesRequest)) {
    throw new Error('Expected argument of type rode.v1alpha1.BatchCreateOccurrencesRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_rode_v1alpha1_BatchCreateOccurrencesRequest(buffer_arg) {
  return proto_v1alpha1_rode_pb.BatchCreateOccurrencesRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rode_v1alpha1_BatchCreateOccurrencesResponse(arg) {
  if (!(arg instanceof proto_v1alpha1_rode_pb.BatchCreateOccurrencesResponse)) {
    throw new Error('Expected argument of type rode.v1alpha1.BatchCreateOccurrencesResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_rode_v1alpha1_BatchCreateOccurrencesResponse(buffer_arg) {
  return proto_v1alpha1_rode_pb.BatchCreateOccurrencesResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var RodeService = exports.RodeService = {
  // Create occurrences 
batchCreateOccurrences: {
    path: '/rode.v1alpha1.Rode/BatchCreateOccurrences',
    requestStream: false,
    responseStream: false,
    requestType: proto_v1alpha1_rode_pb.BatchCreateOccurrencesRequest,
    responseType: proto_v1alpha1_rode_pb.BatchCreateOccurrencesResponse,
    requestSerialize: serialize_rode_v1alpha1_BatchCreateOccurrencesRequest,
    requestDeserialize: deserialize_rode_v1alpha1_BatchCreateOccurrencesRequest,
    responseSerialize: serialize_rode_v1alpha1_BatchCreateOccurrencesResponse,
    responseDeserialize: deserialize_rode_v1alpha1_BatchCreateOccurrencesResponse,
  },
  // Verify that an artifact satisfies a policy
attestPolicy: {
    path: '/rode.v1alpha1.Rode/AttestPolicy',
    requestStream: false,
    responseStream: false,
    requestType: proto_v1alpha1_rode$attest_pb.AttestPolicyRequest,
    responseType: proto_v1alpha1_rode$attest_pb.AttestPolicyResponse,
    requestSerialize: serialize_rode_v1alpha1_AttestPolicyRequest,
    requestDeserialize: deserialize_rode_v1alpha1_AttestPolicyRequest,
    responseSerialize: serialize_rode_v1alpha1_AttestPolicyResponse,
    responseDeserialize: deserialize_rode_v1alpha1_AttestPolicyResponse,
  },
};

exports.RodeClient = grpc.makeGenericClientConstructor(RodeService);
