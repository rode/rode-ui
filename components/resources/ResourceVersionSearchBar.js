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

const ResourceVersionSearchBar = ({ onSubmit, helpText, onChange }) => {
  const { state, dispatch } = useResources();

  const onSearchChange = (event) => {
    if (onChange) {
      onChange();
    }

    dispatch({
      type: resourceActions.SET_VERSION_SEARCH_TERM,
      data: event.target.value,
    });
  };

  return (
    <SearchBar
      onSubmit={onSubmit}
      onChange={onSearchChange}
      label={"Search for a version"}
      name={"resourceVersionSearch"}
      searchTerm={state.versionSearchTerm}
      helpText={helpText}
      buttonLabel={"Search Versions"}
    />
  );
};

ResourceVersionSearchBar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  helpText: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  onChange: PropTypes.func,
};

export default ResourceVersionSearchBar;