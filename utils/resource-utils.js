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

const resourceUrlTypes = [
  {
    type: "Debian",
    regex: "^(deb:/{2}).*:(?<name>.+):(?<version>.+)",
    getGenericName: ({ name }) => `deb://${name}`
  },
  {
    type: "Docker",
    regex: "(?<name>.+)(@sha256:)(?<version>.+)",
    getGenericName: ({ name }) => name,
    aliasLabel: "Tags",
    getFormattedAliases: ({ genericName, aliases }) =>
      aliases.map((alias) => alias.replace(`${genericName}:`, "")),
  },
  {
    type: "File",
    regex: "^(file:/{2}sha256:)(?<version>.+):(?<name>.+)",
    getGenericName: ({ name }) => name,
  },
  {
    type: "Maven",
    regex: "^(gav:/{2})(?<name>.+):(?<version>.+)",
    getGenericName: ({ name }) => `gav://${name}`
  },
  {
    type: "NPM",
    regex: "^(npm:/{2})(?<name>.+):(?<version>.+)",
    getGenericName: ({ name }) => `npm://${name}`,
  },
  {
    type: "NuGet",
    regex: "^(nuget:/{2})(?<name>.+):(?<version>.+)",
    getGenericName: ({ name }) => `nuget://${name}`,
  },
  {
    type: "Python",
    regex: "^(pip:/{2})(?<name>.+):(?<version>.+)",
    getGenericName: ({ name }) => `pip://${name}`,
  },
  {
    type: "RPM",
    regex: "^(rpm:/{2}).*:(?<name>.+):(?<version>.+)",
    getGenericName: ({ name }) => `rpm://${name}`
  },
  {
    type: "Git",
    regex: "^(git:/{2})(?<name>.+)@(?<version>.+)",
    getGenericName: ({ name }) => `git://${name}`,
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
    resourceType: resourceMatch.type,
    resourceName: name,
    resourceVersion: version,
    genericName,
    uri,
    aliasLabel,
    aliases: formattedAliases,
  };
};
