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
import userEvent from "@testing-library/user-event";
import SelectedResource from "components/playground/SelectedResource";

describe("SelectedResource", () => {
  let resource, clearResource, rerender;

  beforeEach(() => {
    resource = {
      name: chance.string(),
      version: chance.string(),
      type: chance.string(),
    };

    clearResource = jest.fn();

    const utils = render(
      <SelectedResource resource={resource} clearResource={clearResource} />
    );

    rerender = utils.rerender;
  });

  it("should render the resource details", () => {
    expect(screen.getByText(resource.name)).toBeInTheDocument();
    expect(screen.getByText(resource.version)).toBeInTheDocument();
    expect(screen.getByText(resource.type)).toBeInTheDocument();
  });

  it("should render the button to clear the resource", () => {
    const renderedButton = screen.getByRole("button", {
      name: "Clear Resource",
    });

    expect(renderedButton).toBeInTheDocument();
    userEvent.click(renderedButton);
    expect(clearResource).toHaveBeenCalledTimes(1);
  });
});
