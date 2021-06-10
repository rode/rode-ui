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
import { useResources } from "providers/resources";
import { resourceActions } from "reducers/resources";
import SearchBar from "components/shared/search/SearchBar";
import { SEARCH_ALL } from "utils/constants";

const ResourceSearchBar = ({ onSubmit, helpText, onChange, onBlur }) => {
  const { state, dispatch } = useResources();

  const onSearchChange = (event) => {
    if (onChange) {
      onChange(event);
    }

    dispatch({
      type: resourceActions.SET_SEARCH_TERM,
      data: event.target.value.trim() === "" ? SEARCH_ALL : event.target.value,
    });
  };

  return (
    <SearchBar
      onSubmit={onSubmit}
      onChange={onSearchChange}
      onBlur={onBlur}
      label={"Search for a resource"}
      name={"resourceSearch"}
      searchTerm={state.searchTerm}
      placeholder={"ex: alpine@sha256:etcetcetc"}
      helpText={helpText}
      buttonLabel={"Search Resources"}
    />
  );
};

ResourceSearchBar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  helpText: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  onChange: PropTypes.func,
};

export default ResourceSearchBar;
