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

import { copy, createSearchFilter, isServerSide } from "utils/shared-utils";
import { showSuccess } from "utils/toast-utils";

jest.mock("utils/toast-utils");

describe("shared utils", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  /* eslint-disable no-undef*/
  describe("isServerSide", () => {
    it("should return true when on the server", () => {
      delete global.window;
      expect(isServerSide()).toBe(true);
    });

    it("should return false when on the client", () => {
      global.window = chance.string();
      expect(isServerSide()).toBe(false);
    });
  });
  /* eslint-enable no-undef */

  describe("createSearchFilter", () => {
    let searchTerm;

    it("should return the filter if the search term is present and not returning all results", () => {
      searchTerm = chance.string();

      expect(createSearchFilter(searchTerm)).toEqual({
        filter: searchTerm,
      });
    });

    it("should return null when the search is returning all results", () => {
      searchTerm = "all";

      expect(createSearchFilter(searchTerm)).toBeNull();
    });

    it("should return null when there is no searchTerm", () => {
      searchTerm = null;

      expect(createSearchFilter(searchTerm)).toBeNull();
    });
  });

  describe("copy", () => {
    beforeEach(() => {
      jest.spyOn(document, "createElement");
      document.execCommand = jest.fn();
    });

    it("should copy the specified text and show a toast", () => {
      copy(chance.string());
      expect(document.createElement).toHaveBeenCalledWith("textarea");
      expect(document.execCommand).toHaveBeenCalledWith("copy");
      expect(showSuccess).toHaveBeenCalledWith("Copied!", {
        autoClose: 1500,
        closeButton: false,
        pauseOnFocusLoss: false,
      });
    });
  });
});
