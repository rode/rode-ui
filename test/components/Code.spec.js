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
import Prism from "prism/prism";

import Code from "components/Code";

jest.mock("prism/prism");

describe("Code", () => {
  let code, rerender;

  beforeEach(() => {
    code = chance.string();
    const utils = render(<Code code={code} language={"rego"} />);
    rerender = utils.rerender;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should highlight the code syntax when Rego is specified", () => {
    expect(Prism.highlightAll).toHaveBeenCalledTimes(1);
    const renderedComponent = screen.getByText(code, {
      selector: "code",
      exact: false,
    });

    expect(renderedComponent).toBeInTheDocument();
    expect(renderedComponent).toHaveClass("language-rego");
    expect(renderedComponent.closest("pre")).toHaveClass("codeContainer");
  });

  it("should highlight the code syntax when json is specified", () => {
    Prism.highlightAll.mockClear();
    rerender(<Code code={code} language={"json"} />);

    expect(Prism.highlightAll).toHaveBeenCalledTimes(1);
    const renderedComponent = screen.getByText(code, {
      selector: "code",
      exact: false,
    });

    expect(renderedComponent).toBeInTheDocument();
    expect(renderedComponent).toHaveClass("language-json");
    expect(renderedComponent.closest("pre")).toHaveClass("codeContainer");
  });

  it("should allow the user to specify additional class names", () => {
    const className = chance.string();
    rerender(
      <Code
        code={code}
        language={chance.pickone(["rego", "json"])}
        className={className}
      />
    );

    const renderedComponent = screen.getByText(code, {
      selector: "code",
      exact: false,
    });

    expect(renderedComponent).toBeInTheDocument();
    expect(renderedComponent.closest("pre")).toHaveClass("codeContainer");
    expect(renderedComponent.closest("pre")).toHaveClass(className);
  });

  it("should allow the user to specify additional props", () => {
    const extraProp = {
      id: chance.string(),
    };
    rerender(
      <Code
        code={code}
        language={chance.pickone(["rego", "json"])}
        {...extraProp}
      />
    );

    const renderedComponent = screen.getByText(code, {
      selector: "code",
      exact: false,
    });

    expect(renderedComponent).toBeInTheDocument();
    expect(renderedComponent.closest("pre")).toHaveAttribute(
      "id",
      extraProp.id
    );
  });
});
