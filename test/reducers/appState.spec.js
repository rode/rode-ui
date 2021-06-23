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

  it("should update state when the action type is 'SET_POLICY_SEARCH_TERM'", () => {
    const actual = appStateReducer(state, {
      type: stateActions.SET_POLICY_SEARCH_TERM,
      data,
    });

    expect(actual).toEqual({
      ...state,
      policySearchTerm: data,
    });
  });

  it("should update state when the action type is 'SET_CURRENT_POLICY'", () => {
    const actual = appStateReducer(state, {
      type: stateActions.SET_CURRENT_POLICY,
      data,
    });

    expect(actual).toEqual({
      ...state,
      currentPolicy: data,
    });
  });

  it("should update state when the action type is 'SET_EVALUATION_POLICY'", () => {
    const actual = appStateReducer(state, {
      type: stateActions.SET_EVALUATION_POLICY,
      data,
    });

    expect(actual).toEqual({
      ...state,
      evaluationPolicy: data,
    });
  });

  it("should update state when the action type is 'SET_EVALUATION_RESOURCE'", () => {
    const actual = appStateReducer(state, {
      type: stateActions.SET_EVALUATION_RESOURCE,
      data,
    });

    expect(actual).toEqual({
      ...state,
      evaluationResource: data,
    });
  });

  it("should update state when the action type is 'SET_CURRENT_POLICY_GROUP'", () => {
    const actual = appStateReducer(state, {
      type: stateActions.SET_CURRENT_POLICY_GROUP,
      data,
    });

    expect(actual).toEqual({
      ...state,
      currentPolicyGroup: data,
    });
  });

  it("should update state when the action type is 'SET_RESOURCE_SEARCH_TERM'", () => {
    const actual = appStateReducer(state, {
      type: stateActions.SET_RESOURCE_SEARCH_TERM,
      data,
    });

    expect(actual).toEqual({
      ...state,
      resourceSearchTerm: data,
    });
  });

  it("should update state when the action type is 'SET_OCCURRENCE_DETAILS'", () => {
    const actual = appStateReducer(state, {
      type: stateActions.SET_OCCURRENCE_DETAILS,
      data,
    });

    expect(actual).toEqual({
      ...state,
      occurrenceDetails: data,
    });
  });

  it("should update state when the action type is 'SET_CURRENT_RESOURCE'", () => {
    const actual = appStateReducer(state, {
      type: stateActions.SET_CURRENT_RESOURCE,
      data,
    });

    expect(actual).toEqual({
      ...state,
      currentResource: data,
    });
  });

  it("should update state when the action type is 'SET_RESOURCE_VERSION_SEARCH_TERM'", () => {
    const actual = appStateReducer(state, {
      type: stateActions.SET_RESOURCE_VERSION_SEARCH_TERM,
      data,
    });

    expect(actual).toEqual({
      ...state,
      resourceVersionSearchTerm: data,
    });
  });

  it("should update state when the action type is 'SET_RESOURCE_TYPE_SEARCH_FILTER'", () => {
    const actual = appStateReducer(state, {
      type: stateActions.SET_RESOURCE_TYPE_SEARCH_FILTER,
      data,
    });

    expect(actual).toEqual({
      ...state,
      resourceTypeSearchFilter: data,
    });
  });
});
