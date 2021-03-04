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

// TODO: test this

const setSearchTerm = (state, data) => {
  return {
    ...state,
    searchTerm: data,
  };
};

const setOccurrenceDetails = (state, data) => {
  return {
    ...state,
    occurrenceDetails: data,
  };
};

const actionMap = {
  SET_SEARCH_TERM: setSearchTerm,
  SET_OCCURRENCE_DETAILS: setOccurrenceDetails,
};

export const resourceReducer = (state, action) => {
  const { type, data } = action;

  return actionMap[type](state, data);
};

export const resourceActions = {
  SET_SEARCH_TERM: "SET_SEARCH_TERM",
  SET_OCCURRENCE_DETAILS: "SET_OCCURRENCE_DETAILS",
};
