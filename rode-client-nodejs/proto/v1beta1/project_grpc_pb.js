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
var proto_v1beta1_project_pb = require('../../proto/v1beta1/project_pb.js');
var google_api_annotations_pb = require('../../google/api/annotations_pb.js');
var google_protobuf_empty_pb = require('google-protobuf/google/protobuf/empty_pb.js');

function serialize_google_protobuf_Empty(arg) {
  if (!(arg instanceof google_protobuf_empty_pb.Empty)) {
    throw new Error('Expected argument of type google.protobuf.Empty');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_google_protobuf_Empty(buffer_arg) {
  return google_protobuf_empty_pb.Empty.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_grafeas_v1beta1_project_CreateProjectRequest(arg) {
  if (!(arg instanceof proto_v1beta1_project_pb.CreateProjectRequest)) {
    throw new Error('Expected argument of type grafeas.v1beta1.project.CreateProjectRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_grafeas_v1beta1_project_CreateProjectRequest(buffer_arg) {
  return proto_v1beta1_project_pb.CreateProjectRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_grafeas_v1beta1_project_DeleteProjectRequest(arg) {
  if (!(arg instanceof proto_v1beta1_project_pb.DeleteProjectRequest)) {
    throw new Error('Expected argument of type grafeas.v1beta1.project.DeleteProjectRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_grafeas_v1beta1_project_DeleteProjectRequest(buffer_arg) {
  return proto_v1beta1_project_pb.DeleteProjectRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_grafeas_v1beta1_project_GetProjectRequest(arg) {
  if (!(arg instanceof proto_v1beta1_project_pb.GetProjectRequest)) {
    throw new Error('Expected argument of type grafeas.v1beta1.project.GetProjectRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_grafeas_v1beta1_project_GetProjectRequest(buffer_arg) {
  return proto_v1beta1_project_pb.GetProjectRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_grafeas_v1beta1_project_ListProjectsRequest(arg) {
  if (!(arg instanceof proto_v1beta1_project_pb.ListProjectsRequest)) {
    throw new Error('Expected argument of type grafeas.v1beta1.project.ListProjectsRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_grafeas_v1beta1_project_ListProjectsRequest(buffer_arg) {
  return proto_v1beta1_project_pb.ListProjectsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_grafeas_v1beta1_project_ListProjectsResponse(arg) {
  if (!(arg instanceof proto_v1beta1_project_pb.ListProjectsResponse)) {
    throw new Error('Expected argument of type grafeas.v1beta1.project.ListProjectsResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_grafeas_v1beta1_project_ListProjectsResponse(buffer_arg) {
  return proto_v1beta1_project_pb.ListProjectsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_grafeas_v1beta1_project_Project(arg) {
  if (!(arg instanceof proto_v1beta1_project_pb.Project)) {
    throw new Error('Expected argument of type grafeas.v1beta1.project.Project');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_grafeas_v1beta1_project_Project(buffer_arg) {
  return proto_v1beta1_project_pb.Project.deserializeBinary(new Uint8Array(buffer_arg));
}


// [Projects](grafeas.io) API.
//
// Manages Grafeas `Projects`. Projects contain sets of other Grafeas entities
// such as `Notes` and `Occurrences`.
var ProjectsService = exports.ProjectsService = {
  // Creates a new project.
createProject: {
    path: '/grafeas.v1beta1.project.Projects/CreateProject',
    requestStream: false,
    responseStream: false,
    requestType: proto_v1beta1_project_pb.CreateProjectRequest,
    responseType: proto_v1beta1_project_pb.Project,
    requestSerialize: serialize_grafeas_v1beta1_project_CreateProjectRequest,
    requestDeserialize: deserialize_grafeas_v1beta1_project_CreateProjectRequest,
    responseSerialize: serialize_grafeas_v1beta1_project_Project,
    responseDeserialize: deserialize_grafeas_v1beta1_project_Project,
  },
  // Gets the specified project.
getProject: {
    path: '/grafeas.v1beta1.project.Projects/GetProject',
    requestStream: false,
    responseStream: false,
    requestType: proto_v1beta1_project_pb.GetProjectRequest,
    responseType: proto_v1beta1_project_pb.Project,
    requestSerialize: serialize_grafeas_v1beta1_project_GetProjectRequest,
    requestDeserialize: deserialize_grafeas_v1beta1_project_GetProjectRequest,
    responseSerialize: serialize_grafeas_v1beta1_project_Project,
    responseDeserialize: deserialize_grafeas_v1beta1_project_Project,
  },
  // Lists projects.
listProjects: {
    path: '/grafeas.v1beta1.project.Projects/ListProjects',
    requestStream: false,
    responseStream: false,
    requestType: proto_v1beta1_project_pb.ListProjectsRequest,
    responseType: proto_v1beta1_project_pb.ListProjectsResponse,
    requestSerialize: serialize_grafeas_v1beta1_project_ListProjectsRequest,
    requestDeserialize: deserialize_grafeas_v1beta1_project_ListProjectsRequest,
    responseSerialize: serialize_grafeas_v1beta1_project_ListProjectsResponse,
    responseDeserialize: deserialize_grafeas_v1beta1_project_ListProjectsResponse,
  },
  // Deletes the specified project.
deleteProject: {
    path: '/grafeas.v1beta1.project.Projects/DeleteProject',
    requestStream: false,
    responseStream: false,
    requestType: proto_v1beta1_project_pb.DeleteProjectRequest,
    responseType: google_protobuf_empty_pb.Empty,
    requestSerialize: serialize_grafeas_v1beta1_project_DeleteProjectRequest,
    requestDeserialize: deserialize_grafeas_v1beta1_project_DeleteProjectRequest,
    responseSerialize: serialize_google_protobuf_Empty,
    responseDeserialize: deserialize_google_protobuf_Empty,
  },
};

exports.ProjectsClient = grpc.makeGenericClientConstructor(ProjectsService);
