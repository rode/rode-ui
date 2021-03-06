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
import { cleanup, render, screen } from "test/testing-utils/renderer";
import userEvent from "@testing-library/user-event";
import OccurrencePreview from "components/occurrences/OccurrencePreview";
import dayjs from "dayjs";
import { stateActions } from "reducers/appState";

jest.mock("dayjs");

describe("OccurrencePreview", () => {
  let mainText,
    timestamp,
    subText,
    currentOccurrence,
    expectedOccurrenceName,
    state,
    dispatch,
    rerender;

  beforeEach(() => {
    mainText = chance.string();
    timestamp = chance.timestamp();
    subText = chance.string();
    expectedOccurrenceName = chance.string();
    currentOccurrence = {
      originals: { occurrences: [{ name: expectedOccurrenceName }] },
    };
    dispatch = jest.fn();

    state = {
      occurrenceDetails: {
        originals: { occurrences: [{ name: chance.string() }] },
      },
    };

    dayjs.mockReturnValue({
      format: jest.fn().mockReturnValue(timestamp),
    });

    const utils = render(
      <OccurrencePreview
        mainText={mainText}
        timestamp={timestamp}
        subText={subText}
        currentOccurrence={currentOccurrence}
      />,
      { state, dispatch }
    );
    rerender = utils.rerender;
  });

  afterEach(() => {
    jest.resetAllMocks();
    cleanup();
  });

  it("should render the occurrence details", () => {
    expect(screen.getByText(mainText)).toBeInTheDocument();
    expect(screen.getByText(timestamp)).toBeInTheDocument();
    expect(screen.getByText(subText)).toBeInTheDocument();
  });

  it("should set the occurrence details when clicked", () => {
    expect(screen.getByTitle(/chevron right/i)).toBeInTheDocument();
    userEvent.click(screen.getByText(mainText));
    expect(dispatch).toHaveBeenCalledTimes(1).toHaveBeenCalledWith({
      type: stateActions.SET_OCCURRENCE_DETAILS,
      data: currentOccurrence,
    });

    state.occurrenceDetails.originals.occurrences[0].name = expectedOccurrenceName;

    rerender(
      <OccurrencePreview
        mainText={mainText}
        timestamp={timestamp}
        subText={subText}
        currentOccurrence={currentOccurrence}
      />
    );

    expect(screen.getByTitle(/chevron double right/i)).toBeInTheDocument();
    userEvent.click(screen.getByText(mainText));

    expect(dispatch).toHaveBeenCalledTimes(2).toHaveBeenCalledWith({
      type: stateActions.SET_OCCURRENCE_DETAILS,
      data: null,
    });
  });
});
