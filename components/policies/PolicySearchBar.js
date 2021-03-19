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
import SearchBar from "components/shared/search/SearchBar";
import { usePolicies } from "providers/policies";
import { policyActions } from "reducers/policies";

const PolicySearchBar = ({ onSubmit, helpText }) => {
  const { state, dispatch } = usePolicies();

  const onChange = (event) => {
    dispatch({
      type: policyActions.SET_SEARCH_TERM,
      data: event.target.value,
    });
  };

  return (
    <SearchBar
      onSubmit={onSubmit}
      onChange={onChange}
      label={"Search for a policy"}
      name={"policySearch"}
      searchTerm={state.searchTerm}
      placeholder={"Ex: max-severe-vulnerabilities"}
      helpText={helpText}
    />
  );
};

PolicySearchBar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  helpText: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
};

export default PolicySearchBar;
