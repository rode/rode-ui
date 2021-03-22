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
import Loading from "components/Loading";

describe("Loading", () => {
  it("should return children if not loading", () => {
    render(
      <Loading loading={false}>
        <p>children</p>
      </Loading>
    );

    expect(screen.queryByTestId("loadingIndicator")).toBeNull();
    expect(screen.getByText("children")).toBeInTheDocument();
  });

  it("should return the loading spinner when loading", () => {
    render(
      <Loading loading={true}>
        <p>children</p>
      </Loading>
    );

    expect(screen.getByTestId("loadingIndicator")).toBeInTheDocument();
    expect(screen.queryByText("children")).not.toBeInTheDocument();
  });

  it("should return the button loading spinner when loading and the loading type is button", () => {
    render(
      <Loading loading={true} type={"button"}>
        <p>children</p>
      </Loading>
    );

    const renderedIndicator = screen.getByTestId("loadingIndicator");
    expect(renderedIndicator).toBeInTheDocument();
    expect(renderedIndicator).toHaveClass("buttonContainer");
    expect(screen.queryByText("children")).not.toBeInTheDocument();
  });
});
