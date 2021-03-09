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
import { render, screen } from "test/testing-utils/renderer";
import Resource from "pages/resources/[resourceUri]";
import { useRouter } from "next/router";
import { createMockResourceUri } from "test/testing-utils/mocks";
import { getResourceDetails } from "utils/resource-utils";

jest.mock("next/router");

describe("Resource Details page", () => {
  let state, router;

  beforeEach(() => {
    router = {
      query: {
        resourceUri: createMockResourceUri(),
      },
    };
    state = {
      searchTerm: chance.string(),
    };

    useRouter.mockReturnValue(router);
    render(<Resource />, { resourceState: state });
  });

  it("should render the resource header information", () => {
    const { resourceName, resourceVersion, resourceType } = getResourceDetails(
      router.query.resourceUri
    );

    expect(screen.getByText(resourceName)).toBeInTheDocument();
    expect(screen.getByText(`Type: ${resourceType}`)).toBeInTheDocument();
    expect(screen.getByText(`Version: ${resourceVersion}`)).toBeInTheDocument();
  });
});
