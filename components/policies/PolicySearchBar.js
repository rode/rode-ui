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
import PropTypes from "prop-types";
import SearchBar from "components/shared/SearchBar";
import { useAppState } from "providers/appState";
import { stateActions } from "reducers/appState";
import { SEARCH_ALL } from "utils/constants";

const PolicySearchBar = ({ onSubmit, helpText, onChange, onBlur }) => {
  const { state, dispatch } = useAppState();

  const onSearchChange = (event) => {
    if (onChange) {
      onChange();
    }
    dispatch({
      type: stateActions.SET_POLICY_SEARCH_TERM,
      data: event.target.value.trim() === "" ? SEARCH_ALL : event.target.value,
    });
  };

  return (
    <SearchBar
      onSubmit={onSubmit}
      onChange={onSearchChange}
      onBlur={onBlur}
      label={"Search for a policy"}
      name={"policySearch"}
      searchTerm={state.policySearchTerm}
      placeholder={"ex: max-severe-vulnerabilities"}
      helpText={helpText}
      buttonLabel={"Search Policies"}
    />
  );
};

PolicySearchBar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  helpText: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
};

export default PolicySearchBar;
