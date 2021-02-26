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

  const nameParts = nameWithUrl.split("/");

  return {
    name: nameParts[nameParts.length - 1],
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
    console.error("Unknown resource type found");
    return null;
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
