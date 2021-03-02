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

import React from "react";
import { render, screen } from "@testing-library/react";
import Error from "pages/_error";

describe("CustomError", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should display an error that occurred on the server", () => {
    const statusCode = chance.natural({ min: 100, max: 500 });

    render(<Error statusCode={statusCode} />);

    expect(
      screen.getByText(`An error ${statusCode} occurred on server.`)
    ).toBeInTheDocument();
  });

  it("should display an error that occurred on the client", () => {
    render(<Error />);

    expect(
      screen.getByText("An error occurred on client.")
    ).toBeInTheDocument();
  });

  describe("getInitialProps", () => {
    let res, err;

    beforeEach(() => {
      res = null;
      err = null;
    });

    it("should return a 404 if no status code is specified", () => {
      const actual = Error.getInitialProps({ res, err });
      expect(actual.statusCode).toBe(404);
    });

    it("should return the response status code if it exists", () => {
      res = {
        statusCode: chance.natural({ min: 100, max: 500 }),
      };

      const actual = Error.getInitialProps({ res, err });
      expect(actual.statusCode).toBe(res.statusCode);
    });

    it("should return the error status code if it exists and response status code does not", () => {
      err = {
        statusCode: chance.natural({ min: 100, max: 500 }),
      };

      const actual = Error.getInitialProps({ res, err });
      expect(actual.statusCode).toBe(err.statusCode);
    });
  });
});
