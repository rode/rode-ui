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
import Drawer from "components/Drawer";
import userEvent from "@testing-library/user-event";

describe("Drawer", () => {
  let isOpen, onClose, children, unmount, rerender;

  beforeEach(() => {
    jest.spyOn(document, "addEventListener");
    jest.spyOn(document, "removeEventListener");
    isOpen = true;
    onClose = jest.fn();
    children = chance.string();

    const utils = render(
      <>
        <p>trigger</p>
        <Drawer isOpen={isOpen} onClose={onClose}>
          <p>{children}</p>
        </Drawer>
      </>
    );
    unmount = utils.unmount;
    rerender = utils.rerender;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should render the close drawer button", () => {
    const renderedCloseButton = screen.getByLabelText("Close Drawer");

    expect(renderedCloseButton).toBeInTheDocument();
    userEvent.click(renderedCloseButton);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("should render the contents of an open drawer", () => {
    expect(screen.getByTestId("drawer")).toHaveClass("openDrawer");
    expect(screen.getByText(children)).toBeInTheDocument();

    rerender(
      <Drawer isOpen={false} onClose={onClose}>
        <p>{children}</p>
      </Drawer>
    );

    expect(screen.getByTestId("drawer")).toHaveClass("closedDrawer");
  });

  it("should register a listener for click events outside of the drawer", () => {
    expect(document.addEventListener)
      .toHaveBeenCalledTimes(1)
      .toHaveBeenCalledWith("mousedown", expect.any(Function));

    unmount();
    expect(document.removeEventListener).toHaveBeenCalledWith(
      "mousedown",
      expect.any(Function)
    );
  });

  it("should allow the user to override the testId", () => {
    const testId = chance.string();
    rerender(
      <Drawer isOpen={true} onClose={onClose} testId={testId}>
        <p>children</p>
      </Drawer>
    );

    expect(screen.getByTestId(testId)).toHaveClass("openDrawer");
  });
});
