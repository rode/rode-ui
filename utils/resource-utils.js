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

import { SEARCH_ALL } from "./constants";

const DOCKER = "DOCKER";
const GIT = "GIT";
const MAVEN = "MAVEN";
const FILE = "FILE";
const NPM = "NPM";
const NUGET = "NUGET";
const PIP = "PIP";
const DEBIAN = "DEBIAN";
const RPM = "RPM";

const resourceUrlTypes = [
  {
    value: DEBIAN,
    label: "Debian",
    regex: "^(deb:/{2}).*:(?<name>.+):(?<version>.+)",
    getGenericName: ({ name }) => `deb://${name}`,
  },
  {
    value: DOCKER,
    label: "Docker",
    regex: "(?<name>.+)(@sha256:)(?<version>.+)",
    getGenericName: ({ name }) => name,
    aliasLabel: "Tags",
    getFormattedAliases: ({ genericName, aliases }) =>
      aliases.map((alias) => alias.replace(`${genericName}:`, "")),
  },
  {
    value: FILE,
    label: "File",
    regex: "^(file:/{2}sha256:)(?<version>.+):(?<name>.+)",
    getGenericName: ({ name }) => `file://${name}`,
  },
  {
    value: GIT,
    label: "Git",
    regex: "^(git:/{2})(?<name>.+)@(?<version>.+)",
    getGenericName: ({ name }) => `git://${name}`,
  },
  {
    value: MAVEN,
    label: "Maven",
    regex: "^(gav:/{2})(?<name>.+):(?<version>.+)",
    getGenericName: ({ name }) => `gav://${name}`,
  },
  {
    value: NPM,
    label: "NPM",
    regex: "^(npm:/{2})(?<name>.+):(?<version>.+)",
    getGenericName: ({ name }) => `npm://${name}`,
  },
  {
    value: NUGET,
    label: "NuGet",
    regex: "^(nuget:/{2})(?<name>.+):(?<version>.+)",
    getGenericName: ({ name }) => `nuget://${name}`,
  },
  {
    value: PIP,
    label: "Python",
    regex: "^(pip:/{2})(?<name>.+):(?<version>.+)",
    getGenericName: ({ name }) => `pip://${name}`,
  },
  {
    value: RPM,
    label: "RPM",
    regex: "^(rpm:/{2}).*:(?<name>.+):(?<version>.+)",
    getGenericName: ({ name }) => `rpm://${name}`,
  },
];

export const getResourceDetails = (uri, resourceVersion) => {
  const resourceMatch = resourceUrlTypes.find((resourceType) =>
    new RegExp(resourceType.regex).exec(uri)
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

  const match = new RegExp(resourceMatch.regex).exec(uri);
  const { name, version } = match.groups;

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
    resourceType: resourceMatch.label,
    resourceName: name,
    resourceVersion: version,
    genericName,
    uri,
    aliasLabel,
    aliases: formattedAliases,
  };
};

export const resourceFilters = resourceUrlTypes.map(({ value, label }) => ({
  value,
  label,
}));

export const RESOURCE_TYPES = {
  DOCKER,
  GIT,
  MAVEN,
  FILE,
  NPM,
  NUGET,
  PIP,
  DEBIAN,
  RPM,
};

export const buildResourceQueryParams = (searchTerm, typeFilters) => {
  let params = {};
  if (searchTerm && searchTerm !== SEARCH_ALL) {
    params.searchTerm = searchTerm;
  }

  if (typeFilters?.length) {
    params.resourceTypes = typeFilters.map(({ value }) => value);
  }

  return params;
};
