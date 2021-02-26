import { getResourceDetails } from "utils/resource-utils";

const createGenericResourceUrl = (name, version, startsWith) => {
  return `${startsWith}${chance.word()}:${name}:${version}`;
};

describe("resource utils", () => {
  describe("getResourceDetails", () => {
    let resourceName, resourceVersion;

    beforeEach(() => {
      resourceName = chance.word();
      resourceVersion = chance.semver();
    });

    it("should return null for an unknown resource type", () => {
      const actual = getResourceDetails(chance.url());

      expect(actual).toBeNull();
    });

    it("should return the correct details for a Debian Resource", () => {
      const url = createGenericResourceUrl(
        resourceName,
        resourceVersion,
        "deb://"
      );
      const actual = getResourceDetails(url);

      expect(actual.resourceType).toBe("Debian");
      expect(actual.resourceName).toBe(resourceName);
      expect(actual.resourceVersion).toBe(resourceVersion);
    });

    it("should return the correct details for an RPM Resource", () => {
      const url = createGenericResourceUrl(
        resourceName,
        resourceVersion,
        "rpm://"
      );
      const actual = getResourceDetails(url);

      expect(actual.resourceType).toBe("RPM");
      expect(actual.resourceName).toBe(resourceName);
      expect(actual.resourceVersion).toBe(resourceVersion);
    });

    it("should return the correct details for a Maven Resource", () => {
      const url = createGenericResourceUrl(
        resourceName,
        resourceVersion,
        "gav://"
      );
      const actual = getResourceDetails(url);

      expect(actual.resourceType).toBe("Maven");
      expect(actual.resourceName).toBe(resourceName);
      expect(actual.resourceVersion).toBe(resourceVersion);
    });

    it("should return the correct details for an NPM Resource", () => {
      const url = createGenericResourceUrl(
        resourceName,
        resourceVersion,
        "npm://"
      );
      const actual = getResourceDetails(url);

      expect(actual.resourceType).toBe("NPM");
      expect(actual.resourceName).toBe(resourceName);
      expect(actual.resourceVersion).toBe(resourceVersion);
    });

    it("should return the correct details for a NuGet Resource", () => {
      const url = createGenericResourceUrl(
        resourceName,
        resourceVersion,
        "nuget://"
      );
      const actual = getResourceDetails(url);

      expect(actual.resourceType).toBe("NuGet");
      expect(actual.resourceName).toBe(resourceName);
      expect(actual.resourceVersion).toBe(resourceVersion);
    });

    it("should return the correct details for a Python Resource", () => {
      const url = createGenericResourceUrl(
        resourceName,
        resourceVersion,
        "pip://"
      );
      const actual = getResourceDetails(url);

      expect(actual.resourceType).toBe("Python");
      expect(actual.resourceName).toBe(resourceName);
      expect(actual.resourceVersion).toBe(resourceVersion);
    });

    it("should return the correct details for a File Resource", () => {
      const url = `file://sha256:${resourceVersion}:${resourceName}`;
      const actual = getResourceDetails(url);

      expect(actual.resourceType).toBe("File");
      expect(actual.resourceName).toBe(resourceName);
      expect(actual.resourceVersion).toBe(resourceVersion);
    });

    it("should return the correct details for a Docker Resource", () => {
      const url = `${chance.url()}/${resourceName}@sha256:${resourceVersion}`;
      const actual = getResourceDetails(url);

      expect(actual.resourceType).toBe("Docker");
      expect(actual.resourceName).toBe(resourceName);
      expect(actual.resourceVersion).toBe(resourceVersion);
    });
  });
});
