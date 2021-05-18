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
const GIT_REGEXP = "^(git:/{2})(.+)@(.+)";

const parseGeneric = (uri) => {
  // deb://dist(optional):arch:name:version
  // rpm://dist(optional):arch:name:version
  // npm://package:version
  // nuget://module:version
  // pip://package:version

  const uriParts = uri.split(":");

  return {
    name: uriParts[uriParts.length - 2],
    version: uriParts[uriParts.length - 1],
  };
};

const parseMaven = (uri) => {
  // gav://group:artifact:version
  const [groupId, artifactId, version] = uri.slice("gav://".length).split(":");

  return {
    name: `${groupId}:${artifactId}`,
    version: version,
  };
};

const parseDocker = (uri) => {
  // https://Namespace/name@sha256:<Checksum>
  const [nameWithUrl, , version] = uri
    .split(new RegExp(DOCKER_REGEXP))
    .filter((value) => value);

  return {
    name: nameWithUrl,
    version: version,
  };
};

const parseFile = (uri) => {
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

const parseGit = (uri) => {
  // git://<host><path>@<commit>
  const [, name, version] = uri
    .split(new RegExp(GIT_REGEXP))
    .filter((value) => value);

  return {
    name,
    version,
  };
};

const resourceUrlTypes = [
  {
    type: "Debian",
    regex: "^(deb:/{2})",
    getGenericName: ({ version, uri }) => uri.replace(version, ""),
  },
  {
    type: "Docker",
    regex: DOCKER_REGEXP,
    parse: parseDocker,
    getGenericName: ({ name }) => name,
    aliasLabel: "Tags",
    getFormattedAliases: ({ genericName, aliases }) =>
      aliases.map((alias) => alias.replace(`${genericName}:`, "")),
  },
  {
    type: "File",
    regex: FILE_REGEXP,
    parse: parseFile,
    getGenericName: ({ name }) => name,
  },
  {
    type: "Maven",
    regex: "^(gav:/{2})",
    parse: parseMaven,
    getGenericName: ({ version, uri }) => uri.replace(version, ""),
  },
  {
    type: "NPM",
    regex: "^(npm:/{2})",
    getGenericName: ({ name }) => name,
  },
  {
    type: "NuGet",
    regex: "^(nuget:/{2})",
    getGenericName: ({ name }) => name,
  },
  {
    type: "Python",
    regex: "^(pip:/{2})",
    getGenericName: ({ name }) => name,
  },
  {
    type: "RPM",
    regex: "^(rpm:/{2})",
    getGenericName: ({ version, uri }) => uri.replace(version, ""),
  },
  {
    type: "Git",
    regex: GIT_REGEXP,
    parse: parseGit,
    getGenericName: ({ name }) => name,
  },
];

export const getResourceDetails = (uri, resourceVersion) => {
  const resourceMatch = resourceUrlTypes.find((resourceType) =>
    uri?.match(resourceType.regex)
  );

  if (!resourceMatch) {
    console.log("Resource URI does not match expected format");
    return {
      resourceType: "Unknown",
      resourceName: uri,
      resourceVersion: "N/A",
      genericName: null,
      uri,
      aliasLabel: "Aliases",
      aliases: [],
    };
  }

  const { name, version } = resourceMatch.parse
    ? resourceMatch.parse(uri)
    : parseGeneric(uri);

  const genericName = resourceMatch.getGenericName({
    name,
    version,
    uri,
  });

  const aliasLabel = resourceMatch.aliasLabel || "Aliases";

  let formattedAliases = [];

  if (resourceVersion) {
    formattedAliases = resourceMatch.getFormattedAliases
      ? resourceMatch.getFormattedAliases({
          genericName,
          aliases: resourceVersion.aliases,
        })
      : resourceVersion.aliases;
  }

  return {
    resourceType: resourceMatch.type,
    resourceName: name,
    resourceVersion: version,
    genericName,
    uri,
    aliasLabel,
    aliases: formattedAliases,
  };
};
