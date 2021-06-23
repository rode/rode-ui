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

import { stateActions, appStateReducer } from "reducers/appState";

describe("AppState Reducer", () => {
  let state, data;

  beforeEach(() => {
    state = {
      [chance.string()]: chance.string(),
    };
    data = chance.string();
  });

  it("should have an action function for each named action", () => {
    const actions = Object.keys(stateActions);
    actions.forEach((action) => {
      const actual = appStateReducer(state, {
        type: action,
        data,
      });

      expect(actual).toBeDefined();
    });

    expect.assertions(actions.length);
  });

  it.each([
    [stateActions.SET_POLICY_SEARCH_TERM, "policySearchTerm"],
    [stateActions.SET_CURRENT_POLICY, "currentPolicy"],
    [stateActions.SET_EVALUATION_POLICY, "evaluationPolicy"],
    [stateActions.SET_EVALUATION_RESOURCE, "evaluationResource"],
    [stateActions.SET_CURRENT_POLICY_GROUP, "currentPolicyGroup"],
    [stateActions.SET_RESOURCE_SEARCH_TERM, "resourceSearchTerm"],
    [
      stateActions.SET_RESOURCE_VERSION_SEARCH_TERM,
      "resourceVersionSearchTerm",
    ],
    [stateActions.SET_RESOURCE_TYPE_SEARCH_FILTER, "resourceTypeSearchFilter"],
    [stateActions.SET_OCCURRENCE_DETAILS, "occurrenceDetails"],
    [stateActions.SET_CURRENT_RESOURCE, "currentResource"],
  ])("should update state when the action type is %s", (action, fieldName) => {
    const actual = appStateReducer(state, {
      type: action,
      data,
    });

    expect(actual).toEqual({
      ...state,
      [fieldName]: data,
    });
  });
});
