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

import { toast } from "react-toastify";
import { showError, showSuccess } from "utils/toast-utils";

jest.mock("react-toastify");

describe("toast utils", () => {
  let message;

  beforeEach(() => {
    message = chance.sentence();
  });

  describe("showSuccess", () => {
    it("should show the toast with the correct options passed", () => {
      showSuccess(message);

      expect(toast).toHaveBeenCalledWith(message, {
        className: expect.stringContaining("success"),
      });
    });

    it("should show the toast with the additional options passed", () => {
      const otherOptions = {
        [chance.string()]: chance.string(),
      };

      showSuccess(message, otherOptions);

      expect(toast).toHaveBeenCalledWith(message, {
        className: expect.stringContaining("success"),
        ...otherOptions,
      });
    });
  });

  describe("showError", () => {
    it("should show the toast with the correct options passed", () => {
      showError(message);

      expect(toast).toHaveBeenCalledWith(message, {
        className: expect.stringContaining("error"),
      });
    });

    it("should show the toast with the additional options passed", () => {
      const otherOptions = {
        [chance.string()]: chance.string(),
      };

      showError(message, otherOptions);

      expect(toast).toHaveBeenCalledWith(message, {
        className: expect.stringContaining("error"),
        ...otherOptions,
      });
    });
  });
});
