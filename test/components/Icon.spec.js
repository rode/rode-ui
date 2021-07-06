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

  it.each([
    ["search", ICON_NAMES.SEARCH],
    ["github", ICON_NAMES.GITHUB],
    ["twitter", ICON_NAMES.TWITTER],
    ["liatrio", ICON_NAMES.LIATRIO],
    ["cog", ICON_NAMES.COG],
    ["shield check", ICON_NAMES.SHIELD_CHECK],
    ["server", ICON_NAMES.SERVER],
    ["chevron right", ICON_NAMES.CHEVRON_RIGHT],
    ["chevron double right", ICON_NAMES.CHEVRON_DOUBLE_RIGHT],
    ["fire", ICON_NAMES.FIRE],
    ["flag", ICON_NAMES.FLAG],
    ["external link", ICON_NAMES.EXTERNAL_LINK],
    ["x circle", ICON_NAMES.X_CIRCLE],
    ["badge check", ICON_NAMES.BADGE_CHECK],
    ["exclamation", ICON_NAMES.EXCLAMATION],
    ["check", ICON_NAMES.CHECK],
    ["menu", ICON_NAMES.MENU],
    ["clipboard copy", ICON_NAMES.CLIPBOARD_COPY],
    ["ban", ICON_NAMES.BAN],
    ["plus circle", ICON_NAMES.PLUS_CIRCLE],
    ["pencil", ICON_NAMES.PENCIL],
    ["badge check outline", ICON_NAMES.BADGE_CHECK_OUTLINE],
    ["exclamation outline", ICON_NAMES.EXCLAMATION_OUTLINE],
  ])('should render the "%s" icon when specified', (iconTitle, iconName) => {
    render(<Icon name={iconName} />);

    expect(screen.getByTitle(new RegExp(iconTitle, "i"))).toBeInTheDocument();
  });
});
