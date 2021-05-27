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
    let resourceName, resourceVersion, url;

    beforeEach(() => {
      resourceName = chance.word();
      resourceVersion = chance.semver();
    });

    it("should return generic values for an undefined resource type", () => {
      url = null;
      const actual = getResourceDetails(url);

      expect(actual.resourceType).toBe("Unknown");
      expect(actual.resourceName).toBe(url);
      expect(actual.resourceVersion).toBe("N/A");
      expect(actual.genericName).toBeNull();
      expect(actual.uri).toBeNull();
      expect(actual.aliasLabel).toBe("Aliases");
      expect(actual.aliases).toEqual([]);
    });

    it("should return generic values for an unknown resource type", () => {
      url = chance.url();
      const actual = getResourceDetails(url);

      expect(actual.resourceType).toBe("Unknown");
      expect(actual.resourceName).toBe(url);
      expect(actual.resourceVersion).toBe("N/A");
      expect(actual.genericName).toBeNull();
      expect(actual.uri).toBe(url);
      expect(actual.aliasLabel).toBe("Aliases");
      expect(actual.aliases).toEqual([]);
    });

    describe("Debian Resource", () => {
      it("should return the correct details for a Debian Resource", () => {
        url = `deb://${chance.word()}:${chance.word()}:${resourceName}:${resourceVersion}`;
        const actual = getResourceDetails(url);

        expect(actual.resourceType).toBe("Debian");
        expect(actual.resourceName).toBe(resourceName);
        expect(actual.resourceVersion).toBe(resourceVersion);
        expect(actual.genericName).toBe(`deb://${resourceName}`);
        expect(actual.uri).toBe(url);
        expect(actual.aliasLabel).toBe("Aliases");
        expect(actual.aliases).toEqual([]);
      });

      it("should return the correct details for a Debian Resource without a specified distribution", () => {
        url = `deb://${chance.word()}:${resourceName}:${resourceVersion}`;
        const actual = getResourceDetails(url);

        expect(actual.resourceType).toBe("Debian");
        expect(actual.resourceName).toBe(resourceName);
        expect(actual.resourceVersion).toBe(resourceVersion);
        expect(actual.genericName).toBe(`deb://${resourceName}`);
        expect(actual.uri).toBe(url);
        expect(actual.aliasLabel).toBe("Aliases");
        expect(actual.aliases).toEqual([]);
      });
    });

    describe("RPM Resource", () => {
      it("should return the correct details for an RPM Resource", () => {
        url = `rpm://${chance.word()}:${chance.word()}:${resourceName}:${resourceVersion}`;
        const actual = getResourceDetails(url);

        expect(actual.resourceType).toBe("RPM");
        expect(actual.resourceName).toBe(resourceName);
        expect(actual.resourceVersion).toBe(resourceVersion);
        expect(actual.genericName).toBe(`rpm://${resourceName}`);
        expect(actual.uri).toBe(url);
        expect(actual.aliasLabel).toBe("Aliases");
        expect(actual.aliases).toEqual([]);
      });

      it("should return the correct details for an RPM Resource without a specified distribution", () => {
        url = `rpm://${chance.word()}:${resourceName}:${resourceVersion}`;
        const actual = getResourceDetails(url);

        expect(actual.resourceType).toBe("RPM");
        expect(actual.resourceName).toBe(resourceName);
        expect(actual.resourceVersion).toBe(resourceVersion);
        expect(actual.genericName).toBe(`rpm://${resourceName}`);
        expect(actual.uri).toBe(url);
        expect(actual.aliasLabel).toBe("Aliases");
        expect(actual.aliases).toEqual([]);
      });
    });

    it("should return the correct details for a Maven Resource", () => {
      const groupId = chance.word();
      const artifactId = chance.word();
      url = `gav://${groupId}:${artifactId}:${resourceVersion}`;
      const resourceName = `${groupId}:${artifactId}`;
      const actual = getResourceDetails(url);

      expect(actual.resourceType).toBe("Maven");
      expect(actual.resourceName).toBe(resourceName);
      expect(actual.resourceVersion).toBe(resourceVersion);
      expect(actual.genericName).toBe(`gav://${resourceName}`);
      expect(actual.uri).toBe(url);
      expect(actual.aliasLabel).toBe("Aliases");
      expect(actual.aliases).toEqual([]);
    });

    it("should return the correct details for an NPM Package", () => {
      url = createGenericResourceUrl(resourceName, resourceVersion, "npm://");

      const actual = getResourceDetails(url);

      expect(actual.resourceType).toBe("NPM");
      expect(actual.resourceName).toBe(resourceName);
      expect(actual.resourceVersion).toBe(resourceVersion);
      expect(actual.genericName).toBe(`npm://${resourceName}`);
      expect(actual.uri).toBe(url);
      expect(actual.aliasLabel).toBe("Aliases");
      expect(actual.aliases).toEqual([]);
    });

    it("should return the correct details for a NuGet Resource", () => {
      url = createGenericResourceUrl(resourceName, resourceVersion, "nuget://");
      const actual = getResourceDetails(url);

      expect(actual.resourceType).toBe("NuGet");
      expect(actual.resourceName).toBe(resourceName);
      expect(actual.resourceVersion).toBe(resourceVersion);
      expect(actual.genericName).toBe(`nuget://${resourceName}`);
      expect(actual.uri).toBe(url);
      expect(actual.aliasLabel).toBe("Aliases");
      expect(actual.aliases).toEqual([]);
    });

    it("should return the correct details for a Python Resource", () => {
      url = createGenericResourceUrl(resourceName, resourceVersion, "pip://");
      const actual = getResourceDetails(url);

      expect(actual.resourceType).toBe("Python");
      expect(actual.resourceName).toBe(resourceName);
      expect(actual.resourceVersion).toBe(resourceVersion);
      expect(actual.genericName).toBe(`pip://${resourceName}`);
      expect(actual.uri).toBe(url);
      expect(actual.aliasLabel).toBe("Aliases");
      expect(actual.aliases).toEqual([]);
    });

    it("should return the correct details for a File Resource", () => {
      url = `file://sha256:${resourceVersion}:${resourceName}`;
      const actual = getResourceDetails(url);

      expect(actual.resourceType).toBe("File");
      expect(actual.resourceName).toBe(resourceName);
      expect(actual.resourceVersion).toBe(resourceVersion);
      expect(actual.genericName).toBe(`file://${resourceName}`);
      expect(actual.uri).toBe(url);
      expect(actual.aliasLabel).toBe("Aliases");
      expect(actual.aliases).toEqual([]);
    });

    describe("Docker Images", () => {
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
      beforeEach(() => {
        url = `git://${resourceName}@${resourceVersion}`;
      });

      it("should return the correct details for a Git Resource", () => {
        const actual = getResourceDetails(url);

        expect(actual.resourceType).toBe("Git");
        expect(actual.resourceName).toBe(resourceName);
        expect(actual.resourceVersion).toBe(resourceVersion);
        expect(actual.genericName).toBe(`git://${resourceName}`);
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
