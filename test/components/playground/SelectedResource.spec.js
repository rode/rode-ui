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
import SelectedResource from "components/playground/SelectedResource";
import { useFetch } from "hooks/useFetch";

jest.mock("hooks/useFetch");

describe("SelectedResource", () => {
  let resourceUri, fetchResponse, rerender;

  beforeEach(() => {
    resourceUri = chance.string();
    fetchResponse = {
      data: {
        originals: chance.string(),
      },
      loading: false,
    };

    useFetch.mockReturnValue(fetchResponse);

    const utils = render(<SelectedResource resourceUri={resourceUri} />);

    rerender = utils.rerender;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should render the occurrence data label", () => {
    expect(screen.getByText("Occurrence Data")).toBeInTheDocument();
  });

  it("should call to fetch the occurrence data when a resource is selected", () => {
    expect(useFetch)
      .toHaveBeenCalledTimes(1)
      .toHaveBeenCalledWith("/api/occurrences", {
        resourceUri: resourceUri,
      });
  });

  it("should render the loading indicator while fetching the occurrence data", () => {
    fetchResponse.loading = true;
    rerender(<SelectedResource resourceUri={resourceUri} />);
    expect(screen.getByTestId("loadingIndicator")).toBeInTheDocument();
  });

  it("should render the occurrence data once fetched", () => {
    expect(
      screen.getByText(JSON.stringify(fetchResponse.data.originals, null, 2), {
        exact: false,
      })
    ).toBeInTheDocument();
  });

  it("should render the instructions if no resource is specified", () => {
    rerender(<SelectedResource resourceUri={null} />);
    expect(screen.getByText(/select a resource to begin/i)).toBeInTheDocument();
  });
});
