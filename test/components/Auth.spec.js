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

jest.mock("next/router");

import React from "react";
import { useRouter } from "next/router";
import Auth from "components/Auth";
import { render, screen } from "test/testing-utils/renderer";

describe("<Auth />", () => {
  let props, path, rerender;

  beforeEach(() => {
    props = {
      enabled: true,
      user: {
        isAuthenticated: true,
        name: chance.word(),
      },
    };
    path = `/${chance.word()}?${chance.word()}=${chance.word()}`;
    useRouter.mockReturnValue({ asPath: path })(
      ({ rerender } = render(<Auth {...props} />))
    );
  });

  it("should prompt to logout", () => {
    const renderedLogout = screen.getByText("Log Out");

    expect(renderedLogout).toBeInTheDocument();
    expect(renderedLogout).toHaveAttribute("href", "/logout");
    expect(screen.getByTestId("auth")).toHaveTextContent(
      `Signed in as ${props.user.name}`,
      {
        normalizeWhitespace: true,
      }
    );
  });

  describe("auth is disabled", () => {
    beforeEach(() => {
      props.enabled = false;
      delete props.user;

      rerender(<Auth {...props} />);
    });

    it("should not render", () => {
      const element = screen.queryByTestId("auth");

      expect(element).not.toBeInTheDocument();
    });
  });

  describe("user is not authenticated", () => {
    beforeEach(() => {
      props.user.isAuthenticated = false;
    });

    it("should render a login prompt", () => {
      const element = screen.getByTestId("auth");

      expect(element).not.toHaveTextContent("Log In");
    });
  });
});
