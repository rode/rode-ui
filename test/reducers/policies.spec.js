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

import { policyActions, policyReducer } from "reducers/policies";

describe("policies reducer", () => {
  let state, data;

  beforeEach(() => {
    state = {
      [chance.string()]: chance.string(),
    };
    data = chance.string();
  });

  it("should have an action function for each named action", () => {
    const actions = Object.keys(policyActions);
    actions.forEach((action) => {
      const actual = policyReducer(state, {
        type: action,
        data,
      });

      expect(actual).toBeDefined();
    });

    expect.assertions(actions.length);
  });

  it("should update state when the action type is 'SET_POLICY_SEARCH_TERM'", () => {
    const actual = policyReducer(state, {
      type: policyActions.SET_POLICY_SEARCH_TERM,
      data,
    });

    expect(actual).toEqual({
      ...state,
      policySearchTerm: data,
    });
  });

  it("should update state when the action type is 'SET_CURRENT_POLICY'", () => {
    const actual = policyReducer(state, {
      type: policyActions.SET_CURRENT_POLICY,
      data,
    });

    expect(actual).toEqual({
      ...state,
      currentPolicy: data,
    });
  });

  it("should update state when the action type is 'SET_EVALUATION_POLICY'", () => {
    const actual = policyReducer(state, {
      type: policyActions.SET_EVALUATION_POLICY,
      data,
    });

    expect(actual).toEqual({
      ...state,
      evaluationPolicy: data,
    });
  });

  it("should update state when the action type is 'SET_EVALUATION_RESOURCE'", () => {
    const actual = policyReducer(state, {
      type: policyActions.SET_EVALUATION_RESOURCE,
      data,
    });

    expect(actual).toEqual({
      ...state,
      evaluationResource: data,
    });
  });

  it("should update state when the action type is 'SET_CURRENT_POLICY_GROUP'", () => {
    const actual = policyReducer(state, {
      type: policyActions.SET_CURRENT_POLICY_GROUP,
      data,
    });

    expect(actual).toEqual({
      ...state,
      currentPolicyGroup: data,
    });
  });
});
