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
import Modal from "components/Modal";

describe("Modal", () => {
  let title, onClose, children, scrollMock, rerender;

  beforeEach(() => {
    title = chance.string();
    onClose = jest.fn();
    children = chance.string();

    scrollMock = jest.fn();
    document.getElementById = jest.fn().mockReturnValue({
      scrollIntoView: scrollMock,
    });
    const utils = render(
      <Modal title={title} onClose={onClose} isVisible={true}>
        {children}
      </Modal>
    );
    rerender = utils.rerender;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should return null when the modal should not be showing", () => {
    scrollMock.mockClear();
    rerender(
      <Modal title={title} onClose={onClose} isVisible={false}>
        {children}
      </Modal>
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(scrollMock).not.toHaveBeenCalled();
  });

  describe("modal should show", () => {
    it("should put the modal into view", () => {
      expect(scrollMock).toHaveBeenCalledTimes(1);
    });

    it("should render the title", () => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });

    it("should render the children of the modal", () => {
      expect(screen.getByText(children)).toBeInTheDocument();
    });

    it("should render the close button", () => {
      const renderedCloseButton = screen.getByTitle(/x circle/i);
      expect(renderedCloseButton).toBeInTheDocument();

      userEvent.click(renderedCloseButton);
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });
});
