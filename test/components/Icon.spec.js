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
import Icon from "components/Icon";
import { ICON_NAMES } from "utils/icon-utils";

describe("Icon", () => {
  it("should allow the user to pass additional classes", () => {
    const className = chance.string();
    render(<Icon name={ICON_NAMES.SEARCH} className={className} />);

    const renderedIcon = screen.getByTitle(/search/i);
    expect(renderedIcon).toBeInTheDocument();
    expect(renderedIcon.closest("span")).toHaveClass(className);
  });

  it("should render the search icon when specified", () => {
    render(<Icon name={ICON_NAMES.SEARCH} />);

    expect(screen.getByTitle(/search/i)).toBeInTheDocument();
  });

  it("should render the github icon when specified", () => {
    render(<Icon name={ICON_NAMES.GITHUB} />);

    expect(screen.getByTitle(/github/i)).toBeInTheDocument();
  });

  it("should render the twitter icon when specified", () => {
    render(<Icon name={ICON_NAMES.TWITTER} />);

    expect(screen.getByTitle(/twitter/i)).toBeInTheDocument();
  });

  it("should render the liatrio icon when specified", () => {
    render(<Icon name={ICON_NAMES.LIATRIO} />);

    expect(screen.getByTitle(/liatrio/i)).toBeInTheDocument();
  });

  it("should render the cog icon when specified", () => {
    render(<Icon name={ICON_NAMES.COG} />);

    expect(screen.getByTitle(/cog/i)).toBeInTheDocument();
  });

  it("should render the shield check icon when specified", () => {
    render(<Icon name={ICON_NAMES.SHIELD_CHECK} />);

    expect(screen.getByTitle(/shield check/i)).toBeInTheDocument();
  });

  it("should render the server icon when specified", () => {
    render(<Icon name={ICON_NAMES.SERVER} />);

    expect(screen.getByTitle(/server/i)).toBeInTheDocument();
  });

  it("should render the chevron icon when specified", () => {
    render(<Icon name={ICON_NAMES.CHEVRON_RIGHT} />);

    expect(screen.getByTitle(/chevron/i)).toBeInTheDocument();
  });

  it("should render the double chevron icon when specified", () => {
    render(<Icon name={ICON_NAMES.CHEVRON_DOUBLE_RIGHT} />);

    expect(screen.getByTitle(/chevron double/i)).toBeInTheDocument();
  });

  it("should render the fire icon when specified", () => {
    render(<Icon name={ICON_NAMES.FIRE} />);

    expect(screen.getByTitle(/fire/i)).toBeInTheDocument();
  });

  it("should render the flag icon when specified", () => {
    render(<Icon name={ICON_NAMES.FLAG} />);

    expect(screen.getByTitle(/flag/i)).toBeInTheDocument();
  });

  it("should render the external link icon when specified", () => {
    render(<Icon name={ICON_NAMES.EXTERNAL_LINK} />);

    expect(screen.getByTitle(/external link/i)).toBeInTheDocument();
  });

  it("should render the x circle icon when specified", () => {
    render(<Icon name={ICON_NAMES.X_CIRCLE} />);

    expect(screen.getByTitle(/x circle/i)).toBeInTheDocument();
  });

  it("should render the badge check icon when specified", () => {
    render(<Icon name={ICON_NAMES.BADGE_CHECK} />);

    expect(screen.getByTitle(/badge check/i)).toBeInTheDocument();
  });

  it("should render the exclamation icon when specified", () => {
    render(<Icon name={ICON_NAMES.EXCLAMATION} />);

    expect(screen.getByTitle(/exclamation/i)).toBeInTheDocument();
  });

  it("should render the check icon when specified", () => {
    render(<Icon name={ICON_NAMES.CHECK} />);

    expect(screen.getByTitle(/check/i)).toBeInTheDocument();
  });

  it("should render the menu icon when specified", () => {
    render(<Icon name={ICON_NAMES.MENU} />);

    expect(screen.getByTitle(/menu/i)).toBeInTheDocument();
  });
});
