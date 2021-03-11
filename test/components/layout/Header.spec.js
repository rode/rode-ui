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
import Header from "components/layout/Header";
import { useRouter } from "next/router";

jest.mock("next/router");

describe("Header", () => {
  let rerender;

  beforeEach(() => {
    useRouter.mockReturnValue({
      pathname: chance.string(),
    });
    const utils = render(<Header />);
    rerender = utils.rerender;
  });

  it("should render the Rode logo", () => {
    expect(screen.getByTitle(/rode logo/i)).toBeInTheDocument();
  });

  it("should render a link for Resources", () => {
    expect(screen.getByText(/resources/i)).toBeInTheDocument();
  });

  it("should render a link for Policies", () => {
    expect(screen.getByText(/policies/i)).toBeInTheDocument();
  });

  it("should render the active link correctly", () => {
    const activeLink = chance.pickone(['resources', 'policies']);

    useRouter.mockReturnValue({
      pathname: `/${activeLink}`
    });
    rerender(<Header/>);

     expect(screen.getByText(activeLink, {exact: false})).toHaveClass('active', {exact: false})
  });
});
