// GENERATED CODE -- DO NOT EDIT!

// Original file comments:
// Copyright 2018 The Grafeas Authors. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
'use strict';
var grpc = require('@grpc/grpc-js');
var proto_v1beta1_grafeas_pb = require('../../proto/v1beta1/grafeas_pb.js');
var google_api_annotations_pb = require('../../google/api/annotations_pb.js');
var google_api_client_pb = require('../../google/api/client_pb.js');
var google_api_field_behavior_pb = require('../../google/api/field_behavior_pb.js');
var google_api_resource_pb = require('../../google/api/resource_pb.js');
var google_protobuf_empty_pb = require('google-protobuf/google/protobuf/empty_pb.js');
var google_protobuf_field_mask_pb = require('google-protobuf/google/protobuf/field_mask_pb.js');
var google_protobuf_timestamp_pb = require('google-protobuf/google/protobuf/timestamp_pb.js');
var proto_v1beta1_attestation_pb = require('../../proto/v1beta1/attestation_pb.js');
var proto_v1beta1_build_pb = require('../../proto/v1beta1/build_pb.js');
var proto_v1beta1_common_pb = require('../../proto/v1beta1/common_pb.js');
var proto_v1beta1_deployment_pb = require('../../proto/v1beta1/deployment_pb.js');
var proto_v1beta1_discovery_pb = require('../../proto/v1beta1/discovery_pb.js');
var proto_v1beta1_image_pb = require('../../proto/v1beta1/image_pb.js');
var proto_v1beta1_intoto_pb = require('../../proto/v1beta1/intoto_pb.js');
var proto_v1beta1_package_pb = require('../../proto/v1beta1/package_pb.js');
var proto_v1beta1_provenance_pb = require('../../proto/v1beta1/provenance_pb.js');
var proto_v1beta1_vulnerability_pb = require('../../proto/v1beta1/vulnerability_pb.js');

function serialize_google_protobuf_Empty(arg) {
  if (!(arg instanceof google_protobuf_empty_pb.Empty)) {
    throw new Error('Expected argument of type google.protobuf.Empty');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_google_protobuf_Empty(buffer_arg) {
  return google_protobuf_empty_pb.Empty.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_grafeas_v1beta1_BatchCreateNotesRequest(arg) {
  if (!(arg instanceof proto_v1beta1_grafeas_pb.BatchCreateNotesRequest)) {
    throw new Error('Expected argument of type grafeas.v1beta1.BatchCreateNotesRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_grafeas_v1beta1_BatchCreateNotesRequest(buffer_arg) {
  return proto_v1beta1_grafeas_pb.BatchCreateNotesRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_grafeas_v1beta1_BatchCreateNotesResponse(arg) {
  if (!(arg instanceof proto_v1beta1_grafeas_pb.BatchCreateNotesResponse)) {
    throw new Error('Expected argument of type grafeas.v1beta1.BatchCreateNotesResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_grafeas_v1beta1_BatchCreateNotesResponse(buffer_arg) {
  return proto_v1beta1_grafeas_pb.BatchCreateNotesResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_grafeas_v1beta1_BatchCreateOccurrencesRequest(arg) {
  if (!(arg instanceof proto_v1beta1_grafeas_pb.BatchCreateOccurrencesRequest)) {
    throw new Error('Expected argument of type grafeas.v1beta1.BatchCreateOccurrencesRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_grafeas_v1beta1_BatchCreateOccurrencesRequest(buffer_arg) {
  return proto_v1beta1_grafeas_pb.BatchCreateOccurrencesRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_grafeas_v1beta1_BatchCreateOccurrencesResponse(arg) {
  if (!(arg instanceof proto_v1beta1_grafeas_pb.BatchCreateOccurrencesResponse)) {
    throw new Error('Expected argument of type grafeas.v1beta1.BatchCreateOccurrencesResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_grafeas_v1beta1_BatchCreateOccurrencesResponse(buffer_arg) {
  return proto_v1beta1_grafeas_pb.BatchCreateOccurrencesResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_grafeas_v1beta1_CreateNoteRequest(arg) {
  if (!(arg instanceof proto_v1beta1_grafeas_pb.CreateNoteRequest)) {
    throw new Error('Expected argument of type grafeas.v1beta1.CreateNoteRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_grafeas_v1beta1_CreateNoteRequest(buffer_arg) {
  return proto_v1beta1_grafeas_pb.CreateNoteRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_grafeas_v1beta1_CreateOccurrenceRequest(arg) {
  if (!(arg instanceof proto_v1beta1_grafeas_pb.CreateOccurrenceRequest)) {
    throw new Error('Expected argument of type grafeas.v1beta1.CreateOccurrenceRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_grafeas_v1beta1_CreateOccurrenceRequest(buffer_arg) {
  return proto_v1beta1_grafeas_pb.CreateOccurrenceRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_grafeas_v1beta1_DeleteNoteRequest(arg) {
  if (!(arg instanceof proto_v1beta1_grafeas_pb.DeleteNoteRequest)) {
    throw new Error('Expected argument of type grafeas.v1beta1.DeleteNoteRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_grafeas_v1beta1_DeleteNoteRequest(buffer_arg) {
  return proto_v1beta1_grafeas_pb.DeleteNoteRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_grafeas_v1beta1_DeleteOccurrenceRequest(arg) {
  if (!(arg instanceof proto_v1beta1_grafeas_pb.DeleteOccurrenceRequest)) {
    throw new Error('Expected argument of type grafeas.v1beta1.DeleteOccurrenceRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_grafeas_v1beta1_DeleteOccurrenceRequest(buffer_arg) {
  return proto_v1beta1_grafeas_pb.DeleteOccurrenceRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_grafeas_v1beta1_GetNoteRequest(arg) {
  if (!(arg instanceof proto_v1beta1_grafeas_pb.GetNoteRequest)) {
    throw new Error('Expected argument of type grafeas.v1beta1.GetNoteRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_grafeas_v1beta1_GetNoteRequest(buffer_arg) {
  return proto_v1beta1_grafeas_pb.GetNoteRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_grafeas_v1beta1_GetOccurrenceNoteRequest(arg) {
  if (!(arg instanceof proto_v1beta1_grafeas_pb.GetOccurrenceNoteRequest)) {
    throw new Error('Expected argument of type grafeas.v1beta1.GetOccurrenceNoteRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_grafeas_v1beta1_GetOccurrenceNoteRequest(buffer_arg) {
  return proto_v1beta1_grafeas_pb.GetOccurrenceNoteRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_grafeas_v1beta1_GetOccurrenceRequest(arg) {
  if (!(arg instanceof proto_v1beta1_grafeas_pb.GetOccurrenceRequest)) {
    throw new Error('Expected argument of type grafeas.v1beta1.GetOccurrenceRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_grafeas_v1beta1_GetOccurrenceRequest(buffer_arg) {
  return proto_v1beta1_grafeas_pb.GetOccurrenceRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_grafeas_v1beta1_GetVulnerabilityOccurrencesSummaryRequest(arg) {
  if (!(arg instanceof proto_v1beta1_grafeas_pb.GetVulnerabilityOccurrencesSummaryRequest)) {
    throw new Error('Expected argument of type grafeas.v1beta1.GetVulnerabilityOccurrencesSummaryRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_grafeas_v1beta1_GetVulnerabilityOccurrencesSummaryRequest(buffer_arg) {
  return proto_v1beta1_grafeas_pb.GetVulnerabilityOccurrencesSummaryRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_grafeas_v1beta1_ListNoteOccurrencesRequest(arg) {
  if (!(arg instanceof proto_v1beta1_grafeas_pb.ListNoteOccurrencesRequest)) {
    throw new Error('Expected argument of type grafeas.v1beta1.ListNoteOccurrencesRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_grafeas_v1beta1_ListNoteOccurrencesRequest(buffer_arg) {
  return proto_v1beta1_grafeas_pb.ListNoteOccurrencesRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_grafeas_v1beta1_ListNoteOccurrencesResponse(arg) {
  if (!(arg instanceof proto_v1beta1_grafeas_pb.ListNoteOccurrencesResponse)) {
    throw new Error('Expected argument of type grafeas.v1beta1.ListNoteOccurrencesResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_grafeas_v1beta1_ListNoteOccurrencesResponse(buffer_arg) {
  return proto_v1beta1_grafeas_pb.ListNoteOccurrencesResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_grafeas_v1beta1_ListNotesRequest(arg) {
  if (!(arg instanceof proto_v1beta1_grafeas_pb.ListNotesRequest)) {
    throw new Error('Expected argument of type grafeas.v1beta1.ListNotesRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_grafeas_v1beta1_ListNotesRequest(buffer_arg) {
  return proto_v1beta1_grafeas_pb.ListNotesRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_grafeas_v1beta1_ListNotesResponse(arg) {
  if (!(arg instanceof proto_v1beta1_grafeas_pb.ListNotesResponse)) {
    throw new Error('Expected argument of type grafeas.v1beta1.ListNotesResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_grafeas_v1beta1_ListNotesResponse(buffer_arg) {
  return proto_v1beta1_grafeas_pb.ListNotesResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_grafeas_v1beta1_ListOccurrencesRequest(arg) {
  if (!(arg instanceof proto_v1beta1_grafeas_pb.ListOccurrencesRequest)) {
    throw new Error('Expected argument of type grafeas.v1beta1.ListOccurrencesRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_grafeas_v1beta1_ListOccurrencesRequest(buffer_arg) {
  return proto_v1beta1_grafeas_pb.ListOccurrencesRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_grafeas_v1beta1_ListOccurrencesResponse(arg) {
  if (!(arg instanceof proto_v1beta1_grafeas_pb.ListOccurrencesResponse)) {
    throw new Error('Expected argument of type grafeas.v1beta1.ListOccurrencesResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_grafeas_v1beta1_ListOccurrencesResponse(buffer_arg) {
  return proto_v1beta1_grafeas_pb.ListOccurrencesResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_grafeas_v1beta1_Note(arg) {
  if (!(arg instanceof proto_v1beta1_grafeas_pb.Note)) {
    throw new Error('Expected argument of type grafeas.v1beta1.Note');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_grafeas_v1beta1_Note(buffer_arg) {
  return proto_v1beta1_grafeas_pb.Note.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_grafeas_v1beta1_Occurrence(arg) {
  if (!(arg instanceof proto_v1beta1_grafeas_pb.Occurrence)) {
    throw new Error('Expected argument of type grafeas.v1beta1.Occurrence');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_grafeas_v1beta1_Occurrence(buffer_arg) {
  return proto_v1beta1_grafeas_pb.Occurrence.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_grafeas_v1beta1_UpdateNoteRequest(arg) {
  if (!(arg instanceof proto_v1beta1_grafeas_pb.UpdateNoteRequest)) {
    throw new Error('Expected argument of type grafeas.v1beta1.UpdateNoteRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_grafeas_v1beta1_UpdateNoteRequest(buffer_arg) {
  return proto_v1beta1_grafeas_pb.UpdateNoteRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_grafeas_v1beta1_UpdateOccurrenceRequest(arg) {
  if (!(arg instanceof proto_v1beta1_grafeas_pb.UpdateOccurrenceRequest)) {
    throw new Error('Expected argument of type grafeas.v1beta1.UpdateOccurrenceRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_grafeas_v1beta1_UpdateOccurrenceRequest(buffer_arg) {
  return proto_v1beta1_grafeas_pb.UpdateOccurrenceRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_grafeas_v1beta1_VulnerabilityOccurrencesSummary(arg) {
  if (!(arg instanceof proto_v1beta1_grafeas_pb.VulnerabilityOccurrencesSummary)) {
    throw new Error('Expected argument of type grafeas.v1beta1.VulnerabilityOccurrencesSummary');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_grafeas_v1beta1_VulnerabilityOccurrencesSummary(buffer_arg) {
  return proto_v1beta1_grafeas_pb.VulnerabilityOccurrencesSummary.deserializeBinary(new Uint8Array(buffer_arg));
}


// [Grafeas](grafeas.io) API.
//
// Retrieves analysis results of Cloud components such as Docker container
// images.
//
// Analysis results are stored as a series of occurrences. An `Occurrence`
// contains information about a specific analysis instance on a resource. An
// occurrence refers to a `Note`. A note contains details describing the
// analysis and is generally stored in a separate project, called a `Provider`.
// Multiple occurrences can refer to the same note.
//
// For example, an SSL vulnerability could affect multiple images. In this case,
// there would be one note for the vulnerability and an occurrence for each
// image with the vulnerability referring to that note.
var GrafeasV1Beta1Service = exports.GrafeasV1Beta1Service = {
  // Gets the specified occurrence.
getOccurrence: {
    path: '/grafeas.v1beta1.GrafeasV1Beta1/GetOccurrence',
    requestStream: false,
    responseStream: false,
    requestType: proto_v1beta1_grafeas_pb.GetOccurrenceRequest,
    responseType: proto_v1beta1_grafeas_pb.Occurrence,
    requestSerialize: serialize_grafeas_v1beta1_GetOccurrenceRequest,
    requestDeserialize: deserialize_grafeas_v1beta1_GetOccurrenceRequest,
    responseSerialize: serialize_grafeas_v1beta1_Occurrence,
    responseDeserialize: deserialize_grafeas_v1beta1_Occurrence,
  },
  // Lists occurrences for the specified project.
listOccurrences: {
    path: '/grafeas.v1beta1.GrafeasV1Beta1/ListOccurrences',
    requestStream: false,
    responseStream: false,
    requestType: proto_v1beta1_grafeas_pb.ListOccurrencesRequest,
    responseType: proto_v1beta1_grafeas_pb.ListOccurrencesResponse,
    requestSerialize: serialize_grafeas_v1beta1_ListOccurrencesRequest,
    requestDeserialize: deserialize_grafeas_v1beta1_ListOccurrencesRequest,
    responseSerialize: serialize_grafeas_v1beta1_ListOccurrencesResponse,
    responseDeserialize: deserialize_grafeas_v1beta1_ListOccurrencesResponse,
  },
  // Deletes the specified occurrence. For example, use this method to delete an
// occurrence when the occurrence is no longer applicable for the given
// resource.
deleteOccurrence: {
    path: '/grafeas.v1beta1.GrafeasV1Beta1/DeleteOccurrence',
    requestStream: false,
    responseStream: false,
    requestType: proto_v1beta1_grafeas_pb.DeleteOccurrenceRequest,
    responseType: google_protobuf_empty_pb.Empty,
    requestSerialize: serialize_grafeas_v1beta1_DeleteOccurrenceRequest,
    requestDeserialize: deserialize_grafeas_v1beta1_DeleteOccurrenceRequest,
    responseSerialize: serialize_google_protobuf_Empty,
    responseDeserialize: deserialize_google_protobuf_Empty,
  },
  // Creates a new occurrence.
createOccurrence: {
    path: '/grafeas.v1beta1.GrafeasV1Beta1/CreateOccurrence',
    requestStream: false,
    responseStream: false,
    requestType: proto_v1beta1_grafeas_pb.CreateOccurrenceRequest,
    responseType: proto_v1beta1_grafeas_pb.Occurrence,
    requestSerialize: serialize_grafeas_v1beta1_CreateOccurrenceRequest,
    requestDeserialize: deserialize_grafeas_v1beta1_CreateOccurrenceRequest,
    responseSerialize: serialize_grafeas_v1beta1_Occurrence,
    responseDeserialize: deserialize_grafeas_v1beta1_Occurrence,
  },
  // Creates new occurrences in batch.
batchCreateOccurrences: {
    path: '/grafeas.v1beta1.GrafeasV1Beta1/BatchCreateOccurrences',
    requestStream: false,
    responseStream: false,
    requestType: proto_v1beta1_grafeas_pb.BatchCreateOccurrencesRequest,
    responseType: proto_v1beta1_grafeas_pb.BatchCreateOccurrencesResponse,
    requestSerialize: serialize_grafeas_v1beta1_BatchCreateOccurrencesRequest,
    requestDeserialize: deserialize_grafeas_v1beta1_BatchCreateOccurrencesRequest,
    responseSerialize: serialize_grafeas_v1beta1_BatchCreateOccurrencesResponse,
    responseDeserialize: deserialize_grafeas_v1beta1_BatchCreateOccurrencesResponse,
  },
  // Updates the specified occurrence.
updateOccurrence: {
    path: '/grafeas.v1beta1.GrafeasV1Beta1/UpdateOccurrence',
    requestStream: false,
    responseStream: false,
    requestType: proto_v1beta1_grafeas_pb.UpdateOccurrenceRequest,
    responseType: proto_v1beta1_grafeas_pb.Occurrence,
    requestSerialize: serialize_grafeas_v1beta1_UpdateOccurrenceRequest,
    requestDeserialize: deserialize_grafeas_v1beta1_UpdateOccurrenceRequest,
    responseSerialize: serialize_grafeas_v1beta1_Occurrence,
    responseDeserialize: deserialize_grafeas_v1beta1_Occurrence,
  },
  // Gets the note attached to the specified occurrence. Consumer projects can
// use this method to get a note that belongs to a provider project.
getOccurrenceNote: {
    path: '/grafeas.v1beta1.GrafeasV1Beta1/GetOccurrenceNote',
    requestStream: false,
    responseStream: false,
    requestType: proto_v1beta1_grafeas_pb.GetOccurrenceNoteRequest,
    responseType: proto_v1beta1_grafeas_pb.Note,
    requestSerialize: serialize_grafeas_v1beta1_GetOccurrenceNoteRequest,
    requestDeserialize: deserialize_grafeas_v1beta1_GetOccurrenceNoteRequest,
    responseSerialize: serialize_grafeas_v1beta1_Note,
    responseDeserialize: deserialize_grafeas_v1beta1_Note,
  },
  // Gets the specified note.
getNote: {
    path: '/grafeas.v1beta1.GrafeasV1Beta1/GetNote',
    requestStream: false,
    responseStream: false,
    requestType: proto_v1beta1_grafeas_pb.GetNoteRequest,
    responseType: proto_v1beta1_grafeas_pb.Note,
    requestSerialize: serialize_grafeas_v1beta1_GetNoteRequest,
    requestDeserialize: deserialize_grafeas_v1beta1_GetNoteRequest,
    responseSerialize: serialize_grafeas_v1beta1_Note,
    responseDeserialize: deserialize_grafeas_v1beta1_Note,
  },
  // Lists notes for the specified project.
listNotes: {
    path: '/grafeas.v1beta1.GrafeasV1Beta1/ListNotes',
    requestStream: false,
    responseStream: false,
    requestType: proto_v1beta1_grafeas_pb.ListNotesRequest,
    responseType: proto_v1beta1_grafeas_pb.ListNotesResponse,
    requestSerialize: serialize_grafeas_v1beta1_ListNotesRequest,
    requestDeserialize: deserialize_grafeas_v1beta1_ListNotesRequest,
    responseSerialize: serialize_grafeas_v1beta1_ListNotesResponse,
    responseDeserialize: deserialize_grafeas_v1beta1_ListNotesResponse,
  },
  // Deletes the specified note.
deleteNote: {
    path: '/grafeas.v1beta1.GrafeasV1Beta1/DeleteNote',
    requestStream: false,
    responseStream: false,
    requestType: proto_v1beta1_grafeas_pb.DeleteNoteRequest,
    responseType: google_protobuf_empty_pb.Empty,
    requestSerialize: serialize_grafeas_v1beta1_DeleteNoteRequest,
    requestDeserialize: deserialize_grafeas_v1beta1_DeleteNoteRequest,
    responseSerialize: serialize_google_protobuf_Empty,
    responseDeserialize: deserialize_google_protobuf_Empty,
  },
  // Creates a new note.
createNote: {
    path: '/grafeas.v1beta1.GrafeasV1Beta1/CreateNote',
    requestStream: false,
    responseStream: false,
    requestType: proto_v1beta1_grafeas_pb.CreateNoteRequest,
    responseType: proto_v1beta1_grafeas_pb.Note,
    requestSerialize: serialize_grafeas_v1beta1_CreateNoteRequest,
    requestDeserialize: deserialize_grafeas_v1beta1_CreateNoteRequest,
    responseSerialize: serialize_grafeas_v1beta1_Note,
    responseDeserialize: deserialize_grafeas_v1beta1_Note,
  },
  // Creates new notes in batch.
batchCreateNotes: {
    path: '/grafeas.v1beta1.GrafeasV1Beta1/BatchCreateNotes',
    requestStream: false,
    responseStream: false,
    requestType: proto_v1beta1_grafeas_pb.BatchCreateNotesRequest,
    responseType: proto_v1beta1_grafeas_pb.BatchCreateNotesResponse,
    requestSerialize: serialize_grafeas_v1beta1_BatchCreateNotesRequest,
    requestDeserialize: deserialize_grafeas_v1beta1_BatchCreateNotesRequest,
    responseSerialize: serialize_grafeas_v1beta1_BatchCreateNotesResponse,
    responseDeserialize: deserialize_grafeas_v1beta1_BatchCreateNotesResponse,
  },
  // Updates the specified note.
updateNote: {
    path: '/grafeas.v1beta1.GrafeasV1Beta1/UpdateNote',
    requestStream: false,
    responseStream: false,
    requestType: proto_v1beta1_grafeas_pb.UpdateNoteRequest,
    responseType: proto_v1beta1_grafeas_pb.Note,
    requestSerialize: serialize_grafeas_v1beta1_UpdateNoteRequest,
    requestDeserialize: deserialize_grafeas_v1beta1_UpdateNoteRequest,
    responseSerialize: serialize_grafeas_v1beta1_Note,
    responseDeserialize: deserialize_grafeas_v1beta1_Note,
  },
  // Lists occurrences referencing the specified note. Provider projects can use
// this method to get all occurrences across consumer projects referencing the
// specified note.
listNoteOccurrences: {
    path: '/grafeas.v1beta1.GrafeasV1Beta1/ListNoteOccurrences',
    requestStream: false,
    responseStream: false,
    requestType: proto_v1beta1_grafeas_pb.ListNoteOccurrencesRequest,
    responseType: proto_v1beta1_grafeas_pb.ListNoteOccurrencesResponse,
    requestSerialize: serialize_grafeas_v1beta1_ListNoteOccurrencesRequest,
    requestDeserialize: deserialize_grafeas_v1beta1_ListNoteOccurrencesRequest,
    responseSerialize: serialize_grafeas_v1beta1_ListNoteOccurrencesResponse,
    responseDeserialize: deserialize_grafeas_v1beta1_ListNoteOccurrencesResponse,
  },
  // Gets a summary of the number and severity of occurrences.
getVulnerabilityOccurrencesSummary: {
    path: '/grafeas.v1beta1.GrafeasV1Beta1/GetVulnerabilityOccurrencesSummary',
    requestStream: false,
    responseStream: false,
    requestType: proto_v1beta1_grafeas_pb.GetVulnerabilityOccurrencesSummaryRequest,
    responseType: proto_v1beta1_grafeas_pb.VulnerabilityOccurrencesSummary,
    requestSerialize: serialize_grafeas_v1beta1_GetVulnerabilityOccurrencesSummaryRequest,
    requestDeserialize: deserialize_grafeas_v1beta1_GetVulnerabilityOccurrencesSummaryRequest,
    responseSerialize: serialize_grafeas_v1beta1_VulnerabilityOccurrencesSummary,
    responseDeserialize: deserialize_grafeas_v1beta1_VulnerabilityOccurrencesSummary,
  },
};

exports.GrafeasV1Beta1Client = grpc.makeGenericClientConstructor(GrafeasV1Beta1Service);
