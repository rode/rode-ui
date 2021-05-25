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

import { resourceActions, resourceReducer } from "reducers/resources";

describe("resources reducer", () => {
  let state, data;

  beforeEach(() => {
    state = {
      [chance.string()]: chance.string(),
    };
    data = chance.string();
  });

  it("should have an action function for each named action", () => {
    const actions = Object.keys(resourceActions);
    actions.forEach((action) => {
      const actual = resourceReducer(state, {
        type: action,
        data,
      });

      expect(actual).toBeDefined();
    });

    expect.assertions(actions.length);
  });

  it("should update state when the action type is 'SET_SEARCH_TERM'", () => {
    const actual = resourceReducer(state, {
      type: resourceActions.SET_SEARCH_TERM,
      data,
    });

    expect(actual).toEqual({
      ...state,
      searchTerm: data,
    });
  });

  it("should update state when the action type is 'SET_OCCURRENCE_DETAILS'", () => {
    const actual = resourceReducer(state, {
      type: resourceActions.SET_OCCURRENCE_DETAILS,
      data,
    });

    expect(actual).toEqual({
      ...state,
      occurrenceDetails: data,
    });
  });

  it("should update state when the action type is 'SET_CURRENT_RESOURCE'", () => {
    const actual = resourceReducer(state, {
      type: resourceActions.SET_CURRENT_RESOURCE,
      data,
    });

    expect(actual).toEqual({
      ...state,
      currentResource: data,
    });
  });

  it("should update state when the action type is 'SET_VERSION_SEARCH_TERM'", () => {
    const actual = resourceReducer(state, {
      type: resourceActions.SET_VERSION_SEARCH_TERM,
      data,
    });

    expect(actual).toEqual({
      ...state,
      versionSearchTerm: data,
    });
  });
});
