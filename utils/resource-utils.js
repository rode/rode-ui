/**
 * Copyright 2021 The Rode Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const DOCKER_REGEXP = "(.+)(@sha256:)(.+)";
const FILE_REGEXP = "^(file:/{2}sha256:)(.+)";

export const parseGeneric = (uri) => {
  // deb://dist(optional):arch:name:version
  // rpm://dist(optional):arch:name:version
  // gav://group:artifact:version
  // npm://package:version
  // nuget://module:version
  // pip://package:version

  const uriParts = uri.split(":");

  return {
    name: uriParts[uriParts.length - 2],
    version: uriParts[uriParts.length - 1],
  };
};

export const parseDocker = (uri) => {
  // https://Namespace/name@sha256:<Checksum>
  const [nameWithUrl, , version] = uri
    .split(new RegExp(DOCKER_REGEXP))
    .filter((value) => value);

  return {
    name: nameWithUrl,
    version: version,
  };
};

export const parseFile = (uri) => {
  // file://sha256:<Checksum>:name

  const [, checksumWithName] = uri
    .split(new RegExp(FILE_REGEXP))
    .filter((value) => value);

  const [checksum, name] = checksumWithName.split(":");

  return {
    name,
    version: checksum,
  };
};

const resourceUrlTypes = [
  {
    type: "Debian",
    regex: "^(deb:/{2})",
  },
  {
    type: "Docker",
    regex: DOCKER_REGEXP,
    parse: parseDocker,
  },
  {
    type: "File",
    regex: FILE_REGEXP,
    parse: parseFile,
  },
  {
    type: "Maven",
    regex: "^(gav:/{2})",
  },
  {
    type: "NPM",
    regex: "^(npm:/{2})",
  },
  {
    type: "NuGet",
    regex: "^(nuget:/{2})",
  },
  {
    type: "Python",
    regex: "^(pip:/{2})",
  },
  {
    type: "RPM",
    regex: "^(rpm:/{2})",
  },
];

export const getResourceDetails = (uri) => {
  const resourceMatch = resourceUrlTypes.find((resourceType) =>
    uri.match(resourceType.regex)
  );

  if (!resourceMatch) {
    console.log("Resource URI does not match expected format");
    return {
      resourceType: "Unknown",
      resourceName: uri,
      resourceVersion: "N/A",
    };
  }

  const { name, version } = resourceMatch.parse
    ? resourceMatch.parse(uri)
    : parseGeneric(uri);

  return {
    resourceType: resourceMatch.type,
    resourceName: name,
    resourceVersion: version,
  };
};
