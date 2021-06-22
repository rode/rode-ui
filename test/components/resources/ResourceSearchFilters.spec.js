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
import { render, screen, act } from "test/testing-utils/renderer";
import ResourceSearchFilters from "components/resources/ResourceSearchFilters";
import userEvent from "@testing-library/user-event";
import { resourceFilters } from "utils/resource-utils";

describe("ResourceSearchFilters", () => {
  let state, dispatch;

  beforeEach(() => {
    state = {
      searchTerm: "",
    };
    dispatch = jest.fn();
    render(<ResourceSearchFilters />, {
      resourceDispatch: dispatch,
      resourceState: state,
    });
  });

  it("should render the dropdown", () => {
    expect(
      screen.getByLabelText("Filter by Resource Type")
    ).toBeInTheDocument();
  });

  it("should show an option for each resource", () => {
    act(() => {
      userEvent.click(screen.getByLabelText("Filter by Resource Type"));
    });
    resourceFilters.forEach((resource) => {
      expect(screen.getByText(resource.label)).toBeInTheDocument();
    });
  });

  it("should set the filters when selected", () => {
    act(() => {
      userEvent.click(screen.getByLabelText("Filter by Resource Type"));
    });

    const resourceToSelect = chance.pickone(resourceFilters);

    userEvent.click(screen.getByText(resourceToSelect.label));

    expect(dispatch)
      .toHaveBeenCalledTimes(1)
      .toHaveBeenCalledWith({
        type: "SET_RESOURCE_TYPE_SEARCH_FILTER",
        data: [resourceToSelect],
      });
  });
});
