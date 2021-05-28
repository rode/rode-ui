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
import styles from "styles/modules/Search.module.scss";
import { useResources } from "providers/resources";
import { resourceActions } from "reducers/resources";
import Dropdown from "components/Dropdown";

// TODO: turn this into a const
const options = [
  {label: "Docker", value: "DOCKER"},
  {label: "Git", value: "GIT"},
  {label: "Maven", "value": "MAVEN"},
  {label: "File", value: "FILE"},
  {label: "NPM", value: "NPM"},
  {label: "Nuget", value: "NUGET"},
  {label: "Pip", value: "PIP"},
  {label: "Debian", value: "DEBIAN"},
  {label: "RPM", value: "RPM"}
]

const ResourceSearchFilters = ({resources}) => {
  const {state, dispatch} = useResources();

  let relevantTypes = options.map((option) => option.value);
  if (state.searchTerm && state.searchTerm !== "all") {
    relevantTypes = Array.from(new Set(resources?.map((resource) => resource.type)));
  }

  const onChange = (selectedValues) => {
    dispatch({
      type: resourceActions.SET_TYPE_FILTER,
      data: selectedValues.map(({value}) => value)
    })
  }

  return (
    <div className={styles.filterContainer}>
      <Dropdown
        options={options}
        onChange={onChange}
        closeMenuOnSelect={false}
        isMulti={true}
        name={"resourceTypeFilter"}
        label={"Filter by Resource Type"}
        placeholder={"Resource Type"}
        hideSelectedOptions={false}
        tabSelectsValue={false}
        isOptionDisabled={(option) => resources && !relevantTypes.includes(option.value)}
        classNamePrefix={"resource-filters"}
      />
    </div>
  );
};

ResourceSearchFilters.propTypes = {
  resources: PropTypes.array
};

export default ResourceSearchFilters;
