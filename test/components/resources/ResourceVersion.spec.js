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
import ResourceVersion from "components/resources/ResourceVersion";
import userEvent from "@testing-library/user-event";
import { copy } from "utils/shared-utils";

jest.mock("utils/shared-utils");

describe("ResourceVersion", () => {
  let version;

  it("should display the shortened version if the length is longer than 12 characters", () => {
    version = chance.string({ min: 12 });
    render(<ResourceVersion version={version} />);

    expect(screen.getByText(version.substring(0, 12))).toBeInTheDocument();
  });

  it("should display the full version if the length is shorter than or equal to 12 characters", () => {
    version = chance.string({ max: 11 });
    render(<ResourceVersion version={version} />);

    expect(screen.getByText(version)).toBeInTheDocument();
  });

  it("should display the copy button if specified", () => {
    version = chance.string({ min: 12 });
    render(<ResourceVersion version={version} copy={true} />);

    const renderedButton = screen.getByTitle(/clipboard copy/i);
    expect(renderedButton).toBeInTheDocument();

    userEvent.click(renderedButton);
    expect(copy).toHaveBeenCalledTimes(1).toHaveBeenCalledWith(version);
  });
});
