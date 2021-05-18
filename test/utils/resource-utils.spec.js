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

import { getResourceDetails } from "utils/resource-utils";

const createGenericResourceUrl = (name, version, startsWith) => {
  return `${startsWith}${name}:${version}`;
};

describe("resource utils", () => {
  describe("getResourceDetails", () => {
    let resourceName, resourceVersion;

    beforeEach(() => {
      resourceName = chance.word();
      resourceVersion = chance.semver();
    });

    it("should return generic values for an undefined resource type", () => {
      const resourceUri = null;
      const actual = getResourceDetails(resourceUri);

      expect(actual.resourceType).toBe("Unknown");
      expect(actual.resourceName).toBe(resourceUri);
      expect(actual.resourceVersion).toBe("N/A");
      expect(actual.genericName).toBeNull();
      expect(actual.uri).toBeNull();
      expect(actual.aliasLabel).toBe("Aliases");
      expect(actual.aliases).toEqual([]);
    });

    it("should return generic values for an unknown resource type", () => {
      const resourceUri = chance.url();
      const actual = getResourceDetails(resourceUri);

      expect(actual.resourceType).toBe("Unknown");
      expect(actual.resourceName).toBe(resourceUri);
      expect(actual.resourceVersion).toBe("N/A");
      expect(actual.genericName).toBeNull();
      expect(actual.uri).toBe(resourceUri);
      expect(actual.aliasLabel).toBe("Aliases");
      expect(actual.aliases).toEqual([]);
    });

    describe("Debian Resource", () => {
      it("should return the correct details for a Debian Resource", () => {
        const url = `deb://${chance.word()}:${chance.word()}:${resourceName}:${resourceVersion}`;
        const actual = getResourceDetails(url);

        expect(actual.resourceType).toBe("Debian");
        expect(actual.resourceName).toBe(resourceName);
        expect(actual.resourceVersion).toBe(resourceVersion);
        expect(actual.genericName).toBe(url.replace(resourceVersion, ""));
        expect(actual.uri).toBe(url);
        expect(actual.aliasLabel).toBe("Aliases");
        expect(actual.aliases).toEqual([]);
      });

      it("should return the correct details for a Debian Resource without a specified distribution", () => {
        const url = `deb://${chance.word()}:${resourceName}:${resourceVersion}`;
        const actual = getResourceDetails(url);

        expect(actual.resourceType).toBe("Debian");
        expect(actual.resourceName).toBe(resourceName);
        expect(actual.resourceVersion).toBe(resourceVersion);
        expect(actual.genericName).toBe(url.replace(resourceVersion, ""));
        expect(actual.uri).toBe(url);
        expect(actual.aliasLabel).toBe("Aliases");
        expect(actual.aliases).toEqual([]);
      });
    });

    describe("RPM Resource", () => {
      it("should return the correct details for an RPM Resource", () => {
        const url = `rpm://${chance.word()}:${chance.word()}:${resourceName}:${resourceVersion}`;
        const actual = getResourceDetails(url);

        expect(actual.resourceType).toBe("RPM");
        expect(actual.resourceName).toBe(resourceName);
        expect(actual.resourceVersion).toBe(resourceVersion);
        expect(actual.genericName).toBe(url.replace(resourceVersion, ""));
        expect(actual.uri).toBe(url);
        expect(actual.aliasLabel).toBe("Aliases");
        expect(actual.aliases).toEqual([]);
      });
      it("should return the correct details for an RPM Resource without a specified distribution", () => {
        const url = `rpm://${chance.word()}:${resourceName}:${resourceVersion}`;
        const actual = getResourceDetails(url);

        expect(actual.resourceType).toBe("RPM");
        expect(actual.resourceName).toBe(resourceName);
        expect(actual.resourceVersion).toBe(resourceVersion);
        expect(actual.genericName).toBe(url.replace(resourceVersion, ""));
        expect(actual.uri).toBe(url);
        expect(actual.aliasLabel).toBe("Aliases");
        expect(actual.aliases).toEqual([]);
      });
    });

    it("should return the correct details for a Maven Resource", () => {
      const groupId = chance.word();
      const artifactId = chance.word();
      const url = `gav://${groupId}:${artifactId}:${resourceVersion}`;
      const resourceName = `${groupId}:${artifactId}`;
      const actual = getResourceDetails(url);

      expect(actual.resourceType).toBe("Maven");
      expect(actual.resourceName).toBe(resourceName);
      expect(actual.resourceVersion).toBe(resourceVersion);
      expect(actual.genericName).toBe(url.replace(resourceVersion, ""));
      expect(actual.uri).toBe(url);
      expect(actual.aliasLabel).toBe("Aliases");
      expect(actual.aliases).toEqual([]);
    });

    it("should return the correct details for an NPM Package", () => {
      const url = createGenericResourceUrl(
        resourceName,
        resourceVersion,
        "npm://"
      );

      const actual = getResourceDetails(url);

      expect(actual.resourceType).toBe("NPM");
      expect(actual.resourceName).toBe(resourceName);
      expect(actual.resourceVersion).toBe(resourceVersion);
      expect(actual.genericName).toBe(resourceName);
      expect(actual.uri).toBe(url);
      expect(actual.aliasLabel).toBe("Aliases");
      expect(actual.aliases).toEqual([]);
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
      expect(actual.genericName).toBe(resourceName);
      expect(actual.uri).toBe(url);
      expect(actual.aliasLabel).toBe("Aliases");
      expect(actual.aliases).toEqual([]);
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
      expect(actual.genericName).toBe(resourceName);
      expect(actual.uri).toBe(url);
      expect(actual.aliasLabel).toBe("Aliases");
      expect(actual.aliases).toEqual([]);
    });

    it("should return the correct details for a File Resource", () => {
      const url = `file://sha256:${resourceVersion}:${resourceName}`;
      const actual = getResourceDetails(url);

      expect(actual.resourceType).toBe("File");
      expect(actual.resourceName).toBe(resourceName);
      expect(actual.resourceVersion).toBe(resourceVersion);
      expect(actual.genericName).toBe(resourceName);
      expect(actual.uri).toBe(url);
      expect(actual.aliasLabel).toBe("Aliases");
      expect(actual.aliases).toEqual([]);
    });

    describe("Docker Images", () => {
      let url;

      beforeEach(() => {
        url = `${resourceName}@sha256:${resourceVersion}`;
      });

      it("should return the correct details for a Docker Resource", () => {
        const actual = getResourceDetails(url);

        expect(actual.resourceType).toBe("Docker");
        expect(actual.resourceName).toBe(resourceName);
        expect(actual.resourceVersion).toBe(resourceVersion);
        expect(actual.genericName).toBe(resourceName);
        expect(actual.uri).toBe(url);
        expect(actual.aliasLabel).toBe("Tags");
        expect(actual.aliases).toEqual([]);
      });

      it("should return the formatted aliases when versions are specified", () => {
        const expectedAlias = chance.string();
        const version = { aliases: [`${resourceName}:${expectedAlias}`] };
        const actual = getResourceDetails(url, version);

        expect(actual.aliases).toEqual([expectedAlias]);
      });
    });

    describe("Git Resources", () => {
      let url;
      beforeEach(() => {
        url = `git://${resourceName}@${resourceVersion}`;
      });

      it("should return the correct details for a Git Resource", () => {
        const actual = getResourceDetails(url);

        expect(actual.resourceType).toBe("Git");
        expect(actual.resourceName).toBe(resourceName);
        expect(actual.resourceVersion).toBe(resourceVersion);
        expect(actual.genericName).toBe(resourceName);
        expect(actual.uri).toBe(url);
        expect(actual.aliasLabel).toBe("Aliases");
        expect(actual.aliases).toEqual([]);
      });

      it("should return the formatted aliases when versions are specified", () => {
        const expectedAlias = chance.string();
        const version = { aliases: [expectedAlias] };
        const actual = getResourceDetails(url, version);

        expect(actual.aliases).toEqual([expectedAlias]);
      });
    });
  });
});
