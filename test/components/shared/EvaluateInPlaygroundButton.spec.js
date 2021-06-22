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
import EvaluateInPlaygroundButton from "components/shared/EvaluateInPlaygroundButton";
import userEvent from "@testing-library/user-event";

describe("EvaluateInPlaygroundButton", () => {
  let onClick;

  beforeEach(() => {
    onClick = jest.fn();

    render(<EvaluateInPlaygroundButton onClick={onClick} />);
  });

  it("should render the button", () => {
    expect(
      screen.getByLabelText("Evaluate in Policy Playground")
    ).toBeInTheDocument();
  });

  it("should call the passed function when pressed", () => {
    userEvent.click(screen.getByLabelText("Evaluate in Policy Playground"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
