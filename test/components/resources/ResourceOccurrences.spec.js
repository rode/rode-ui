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
import { useFetch } from "hooks/useFetch";
import { createMockOccurrence } from "test/testing-utils/mocks";
import ResourceOccurrences from "components/resources/ResourceOccurrences";

jest.mock("hooks/useFetch");

describe("ResourceOccurrences", () => {
  let data, resourceUri;

  beforeEach(() => {
    data = chance.n(() => createMockOccurrence("DISCOVERY"), chance.d4());
    resourceUri = chance.string();
  });

  it("should not make the fetch call if there is no resource uri specified", () => {
    useFetch.mockReturnValue({});
    render(<ResourceOccurrences resourceUri={null} />);
    expect(useFetch).toHaveBeenCalledTimes(1).toHaveBeenCalledWith(null, {
      resourceUri: null,
    });
  });

  it("should call to fetch the occurrences is a uri is specified", () => {
    useFetch.mockReturnValue({});
    render(<ResourceOccurrences resourceUri={resourceUri} />);
    expect(useFetch)
      .toHaveBeenCalledTimes(2)
      .toHaveBeenCalledWith("/api/occurrences", {
        resourceUri,
      });
  });

  it("should show a loading indicator while fetching the data", () => {
    useFetch.mockReturnValue({
      loading: true,
    });

    render(<ResourceOccurrences resourceUri={resourceUri} />);

    expect(screen.getByTestId("loadingIndicator")).toBeInTheDocument();
  });

  it("should render an card for each occurrence", () => {
    useFetch.mockReturnValue({
      loading: false,
      data,
    });

    render(<ResourceOccurrences resourceUri={resourceUri} />);

    expect(screen.queryByTestId("loadingIndicator")).not.toBeInTheDocument();
    data.forEach((occurrence) => {
      expect(screen.getAllByText(occurrence.kind)).toHaveLength(data.length);
    });
  });
});
