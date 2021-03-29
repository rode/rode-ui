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

const setSearchTerm = (state, data) => {
  return {
    ...state,
    searchTerm: data,
  };
};

const setCurrentPolicy = (state, data) => {
  return {
    ...state,
    currentPolicy: data,
  };
};

const actionMap = {
  SET_SEARCH_TERM: setSearchTerm,
  SET_CURRENT_POLICY: setCurrentPolicy,
};

export const policyReducer = (state, action) => {
  const { type, data } = action;

  return actionMap[type](state, data);
};

export const policyActions = {
  SET_SEARCH_TERM: "SET_SEARCH_TERM",
  SET_CURRENT_POLICY: "SET_CURRENT_POLICY",
};
